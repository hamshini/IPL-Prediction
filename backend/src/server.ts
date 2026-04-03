import express from "express";
import { prisma } from "./lib/prisma";
import cors from "cors"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:3000",                  // local dev
        "https://ipl-prediction-frontend.vercel.app"  // your deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

function getUserFromToken(req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    return jwt.verify(token, process.env.JWT_SECRET!);
}
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// app.post("/users", async (req, res) => {
//     const { email, name, role, password } = req.body;
//     const user = await prisma.user.create({
//         data: { email, name, role, password },
//     });
//     res.json(user);
// });

// Get Teams
app.get("/teams", async (req, res) => {
    const teams = await prisma.team.findMany();
    res.json(teams);
});

app.get("/teams/shortname/:shortName", async (req, res) => {
    const { shortName } = req.params;

    const team = await prisma.team.findFirst({
        where: { shortName }
    });

    res.json(team);
});

//create team
app.post("/teams", async (req, res) => {
    const { name, shortName, captain } = req.body;
    const team = await prisma.team.create({
        data: { name, shortName, captain },
    });
    res.json(team);
});

// Matches
app.get("/matches", async (req, res) => {
    const matches = await prisma.match.findMany({
        orderBy: {
            matchNo: "asc"
        }
    });

    res.json(matches);
});

app.post("/matches", async (req, res) => {
    const { matchNo, teamAShortName, teamBShortName, venue, date, scheduledStart } = req.body;

    const teamA = await prisma.team.findUnique({
        where: { shortName: teamAShortName }
    });

    const teamB = await prisma.team.findUnique({
        where: { shortName: teamBShortName }
    });

    if (!teamA || !teamB) {
        return res.status(400).json({ error: "Invalid team short name" });
    }

    const match = await prisma.match.create({
        data: {
            matchNo,
            venue,
            date: new Date(date),
            scheduledStart: new Date(scheduledStart),
            teamA: { connect: { shortName: teamA.shortName } },
            teamB: { connect: { shortName: teamB.shortName } },
        },
    });

    res.json(match);
});

app.get("/matches/upcoming", async (req, res) => {
    try {
        // ✅ Start of today (00:00)
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    { status: "STARTED" }, // ✅ always include
                    {
                        date: {
                            gte: startOfToday // ✅ today + future
                        }
                    }
                ]
            },
            orderBy: [
                { date: "asc" },
                { matchNo: "asc" }
            ],
        })

        // ✅ prioritize STARTED matches
        const sorted = matches.sort((a, b) => {
            if (a.status === "STARTED" && b.status !== "STARTED") return -1
            if (a.status !== "STARTED" && b.status === "STARTED") return 1
            return 0
        })

        res.json(sorted.slice(0, 3))

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error fetching matches" })
    }
})

app.get("/players", async (req, res) => {
    const player_details = await prisma.player.findMany();
    res.json(player_details);
});

app.post("/players/by-teams", async (req, res) => {
    const { teams } = req.body; // teams=["RCB", "MI"]

    try {
        const players = await prisma.player.findMany({
            where: {
                team: {
                    shortName: {
                        in: teams,
                    },
                },
            },
        });

        res.json(players);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;

    // Check if email or name already exists
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { name }] }
    });

    if (existingUser) {
        return res.status(400).json({ error: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, name, password: hashedPassword }
    });

    res.json({ message: "User created", userId: user.id });
});

app.post("/login", async (req, res) => {
    const { login, password } = req.body; // login = email or name

    const user = await prisma.user.findFirst({
        where: { OR: [{ email: login }, { name: login }] }
    });

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
    }

    // generate JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Player Picks
app.post("/picks", async (req, res) => {
    try {
        // 1️⃣ Get token
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ error: "Unauthorized" })

        const token = authHeader.split(" ")[1]
        if (!token) return res.status(401).json({ error: "Unauthorized" })

        // 2️⃣ Verify JWT
        let payload: any
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!)
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" })
        }

        const submittedBy = payload.userId // 👈 logged-in user

        // 3️⃣ Get data
        const data = req.body

        // 4️⃣ Find selected user (from dropdown)
        const selectedUser = await prisma.user.findFirst({
            where: { name: data.user }
        })

        if (!selectedUser) {
            return res.status(400).json({ error: "Selected user not found" })
        }

        const userId = selectedUser.id // 👈 whose picks these are

        // 5️⃣ Process picks
        const pickPromises = Object.keys(data)
            .filter((key) => key.startsWith("team_"))
            .map(async (teamKey) => {
                const matchId = teamKey.split("_")[1]
                if (!matchId) return

                const teamPickedId = data[teamKey]
                const mom1Picked = data[`mom1_${matchId}`] || null
                const mom2Picked = data[`mom2_${matchId}`] || null

                // ✅ ONLY CREATE HISTORY
                await prisma.pickHistory.create({
                    data: {
                        playerPickId: null,
                        userId,
                        matchId,
                        submittedBy,
                        teamPickedId,
                        mom1Picked,
                        mom2Picked,
                        status: "PENDING",
                    },
                })
            })

        await Promise.all(pickPromises)

        res.json({ message: "Picks submitted successfully" })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to submit picks" })
    }
})

app.post("/season-prediction", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const submittedBy = payload.userId;

        const {
            userId,
            top1TeamId,
            top2TeamId,
            top3TeamId,
            top4TeamId,
            bottom1TeamId,
            bottom2TeamId,
            orangeCap1,
            orangeCap2,
            orangeCap3,
            purpleCap1,
            purpleCap2,
            purpleCap3,
        } = req.body;

        if (!userId) return res.status(400).json({ error: "userId is required" });

        // Upsert main prediction
        const prediction = await prisma.seasonPrediction.upsert({
            where: { userId },
            create: {
                userId,
                submittedBy,
                top1TeamId,
                top2TeamId,
                top3TeamId,
                top4TeamId,
                bottom1TeamId,
                bottom2TeamId,
                orangeCap1,
                orangeCap2,
                orangeCap3,
                purpleCap1,
                purpleCap2,
                purpleCap3,
                submittedAt: new Date(),
            },
            update: {
                submittedBy,
                top1TeamId,
                top2TeamId,
                top3TeamId,
                top4TeamId,
                bottom1TeamId,
                bottom2TeamId,
                orangeCap1,
                orangeCap2,
                orangeCap3,
                purpleCap1,
                purpleCap2,
                purpleCap3,
                lastModifiedAt: new Date(),
            },
        });

        // Add history
        await prisma.seasonPredictionHistory.create({
            data: {
                seasonPredictionId: prediction.id,
                top1TeamId,
                top2TeamId,
                top3TeamId,
                top4TeamId,
                bottom1TeamId,
                bottom2TeamId,
                orangeCap1,
                orangeCap2,
                orangeCap3,
                purpleCap1,
                purpleCap2,
                purpleCap3,
                modifiedBy: submittedBy,
            },
        });

        res.json({ message: "Season prediction submitted successfully", prediction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/getTopBottomPrediction", async (req, res) => {
    const seasonPrediction_details = await prisma.seasonPrediction.findMany();
    console.log(seasonPrediction_details);

    res.json(seasonPrediction_details);
});

app.get("/getMatchPicks", async (req, res) => {
    const getMatchPick_details = await prisma.playerPick.findMany();
    console.log(getMatchPick_details);

    res.json(getMatchPick_details);
});

app.post("/admin/match/start", async (req, res) => {
    try {
        const { matchId } = req.body

        const updated = await prisma.match.update({
            where: { id: matchId },
            data: {
                status: "STARTED",
                actualStart: new Date(), // ✅ always now
            },
        })

        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: "Error starting match" })
    }
})

app.post("/admin/match/delay", async (req, res) => {
    try {
        const { matchId, actualStart } = req.body

        if (!actualStart) {
            return res.status(400).json({
                error: "Start time required when delaying match",
            })
        }

        const updated = await prisma.match.update({
            where: { id: matchId },
            data: {
                status: "DELAYED",
                actualStart: new Date(actualStart),
            },
        })

        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: "Error delaying match" })
    }

})

app.get("/admin/match/:matchId/picks", async (req, res) => {
    try {
        const { matchId } = req.params

        const match = await prisma.match.findUnique({
            where: { id: matchId },
        })

        // ❗ BLOCK if no start time
        if (!match?.actualStart) {
            return res.status(403).json({
                error: "Match not started yet",
            })
        }
        const picks = await prisma.pickHistory.findMany({
            where: {
                matchId, // ✅ direct filter
            },
            include: {
                user: true, // ✅ get user directly
            },
            orderBy: [
                { user: { name: "asc" } },
                { modifiedAt: "asc" },
            ],
        })

        res.json(picks)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error fetching picks" })
    }
})

app.post("/match/complete", async (req, res) => {
    try {
        const { matchId, winningTeamId, manOfMatch } = req.body;

        if (!matchId || !winningTeamId || !manOfMatch) {
            return res.status(400).json({ error: "All fields required" });
        }
        const match = await prisma.match.findUnique({
            where: { id: matchId }
        });

        if (match?.status !== "STARTED") {
            return res.status(400).json({ error: "Match not started" });
        }
        // ✅ prevent duplicate scoring
        const existing = await prisma.matchScore.findFirst({
            where: { matchId }
        });

        // if (existing) {
        //     return res.status(400).json({ error: "Already scored" });
        // }

        // 1️⃣ Update match
        await prisma.match.update({
            where: { id: matchId },
            data: {
                status: "COMPLETED",
                winningTeamId,
                manOfMatch
            }
        });

        // 2️⃣ Get approved picks
        const picks = await prisma.playerPick.findMany({
            where: {
                matchId,
                status: "APPROVED"
            }
        });

        // 3️⃣ Loop
        for (const pick of picks) {

            const isWin = pick.teamPickedId === winningTeamId;

            const isMom =
                pick.mom1Picked === manOfMatch ||
                pick.mom2Picked === manOfMatch;

            // 🔁 streak
            const last = await prisma.matchScore.findFirst({
                where: { userId: pick.userId },
                orderBy: { createdAt: "desc" }
            });

            let streak = 0;
            if (last?.result === "WIN") {
                streak = last.streak;
            }

            let points = 0;

            if (isWin) {
                streak += 1;

                points = Math.min(streak * 10, 30); // 10 for 1st win, 20 for 2nd, max 30

            } else {
                points = -10;
                streak = 0;
            }

            // ✅ MoM rule (either matches)
            if (isMom) {
                points += 5;
            }

            await prisma.matchScore.create({
                data: {
                    userId: pick.userId,
                    matchId,
                    result: isWin ? "WIN" : "LOSS",
                    streak,
                    points,
                    isMomCorrect: isMom
                }
            });
        }

        res.json({ message: "Match completed + scoring done" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error completing match" });
    }
});

app.post("/admin/match/cancel", async (req, res) => {
    try {
        const { matchId } = req.body

        const updated = await prisma.match.update({
            where: { id: matchId },
            data: {
                status: "CANCELLED",
            },
        })

        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: "Error cancelling match" })
    }
})

app.post("/admin/pick/approve", async (req, res) => {
    try {
        const { historyId } = req.body
        const user: any = getUserFromToken(req);
        const adminId = user.userId;
        const history = await prisma.pickHistory.findUnique({
            where: { id: historyId },
        })

        if (!history) {
            return res.status(404).json({ error: "History not found" })
        }

        // 🚫 RULE: Only one approved pick per user per match
        const existingApproved = await prisma.playerPick.findFirst({
            where: {
                userId: history.userId,
                matchId: history.matchId,
                status: "APPROVED",
            },
        })

        if (existingApproved) {
            return res.status(400).json({
                error: "An approved pick already exists. Reject it first.",
            })
        }

        // 🔍 Check if PlayerPick already exists (any status)
        let pick = await prisma.playerPick.findUnique({
            where: {
                userId_matchId: {
                    userId: history.userId,
                    matchId: history.matchId,
                },
            },
        })

        if (pick) {
            // ✅ Update existing
            pick = await prisma.playerPick.update({
                where: { id: pick.id },
                data: {
                    status: "APPROVED",
                    approvalTime: new Date(),
                    approvedBy: adminId,
                    teamPickedId: history.teamPickedId,
                    mom1Picked: history.mom1Picked,
                    mom2Picked: history.mom2Picked,
                },
            })
        } else {
            // ✅ Create new
            pick = await prisma.playerPick.create({
                data: {
                    userId: history.userId,
                    submittedBy: history.submittedBy,
                    matchId: history.matchId,
                    teamPickedId: history.teamPickedId,
                    mom1Picked: history.mom1Picked,
                    mom2Picked: history.mom2Picked,
                    status: "APPROVED",
                    approvalTime: new Date(),
                    approvedBy: adminId,
                },
            })
        }

        // 🔗 Link history
        await prisma.pickHistory.update({
            where: { id: historyId },
            data: {
                playerPickId: pick.id,
                status: "APPROVED",
            },
        })

        res.json(pick)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error approving pick" })
    }
})

app.post("/admin/pick/reject", async (req, res) => {
    try {
        const { historyId } = req.body

        const history = await prisma.pickHistory.findUnique({
            where: { id: historyId },
        })

        if (!history) {
            return res.status(404).json({ error: "History not found" })
        }

        // ✅ CASE 1: PlayerPick exists → update it
        if (history.playerPickId) {
            const updatedPick = await prisma.playerPick.update({
                where: { id: history.playerPickId },
                data: {
                    status: "REJECTED",
                },
            })

            // also update history for UI
            await prisma.pickHistory.update({
                where: { id: historyId },
                data: { status: "REJECTED" },
            })

            return res.json(updatedPick)
        }

        // ✅ CASE 2: No PlayerPick yet → just update history
        const updatedHistory = await prisma.pickHistory.update({
            where: { id: historyId },
            data: {
                status: "REJECTED",
            },
        })

        res.json(updatedHistory)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error rejecting pick" })
    }
})

app.get("/matches/:matchId/picks", async (req, res) => {
    try {
        const { matchId } = req.params
        const match = await prisma.match.findUnique({
            where: { id: matchId },
        })
        if (!match?.actualStart) {
            return res.status(403).json({
                error: "Picks will be visible after match starts",
            })
        }
        const picks = await prisma.playerPick.findMany({
            where: {
                matchId,
                status: "APPROVED", // ✅ only approved
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: "asc",
                },
            },
        })

        res.json(picks)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error fetching approved picks" })
    }
})

app.get("/leaderboard", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true },
        });

        const matches = await prisma.match.findMany({
            where: { status: "COMPLETED" },
            orderBy: { date: "asc" }
        });

        const allScores = await prisma.matchScore.findMany();
        const allPicks = await prisma.playerPick.findMany();

        const leaderboard = users.map((user) => {

            let totalPoints = 0;
            let wins = 0;
            let streak = 0;
            let lastResult = "-";
            let lastPoints = 0;

            matches.forEach((match) => {

                const score = allScores.find(
                    s => s.userId === user.id && s.matchId === match.id
                );

                const pick = allPicks.find(
                    p => p.userId === user.id && p.matchId === match.id
                );

                let matchPoints = 0;
                let result = "LOSS";

                // ✅ IMPORTANT FIX
                if (!pick || pick.status !== "APPROVED") {
                    matchPoints = -10;
                    result = "LOSS";
                    streak = 0;
                } else if (score) {
                    matchPoints = score.points;
                    result = score.result;

                    if (result === "WIN") {
                        wins++;
                        streak++;
                    } else {
                        streak = 0;
                    }
                } else {
                    // fallback safety
                    matchPoints = -10;
                    result = "LOSS";
                    streak = 0;
                }

                totalPoints += matchPoints;

                // track last match
                lastResult = result;
                lastPoints = matchPoints;
            });

            const totalMatches = matches.length;
            const winPercent =
                totalMatches === 0 ? 0 : Math.round((wins / totalMatches) * 100);

            return {
                name: user.name,
                totalPoints,
                winPercent,
                latestResult: `${lastResult} (${lastPoints})`,
                streak,
            };
        });

        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        res.json(leaderboard);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Leaderboard error" });
    }
});

app.get("/match/:matchId/scoreboard", async (req, res) => {
    try {
        const { matchId } = req.params

        const match = await prisma.match.findUnique({
            where: { id: matchId }
        })
        if (!match) {
            return res.status(404).json({ error: "Match not found" })
        }
        // ❌ If match not completed
        if (match.status !== "COMPLETED") {
            return res.status(400).json({
                error: "Scoreboard not available. Match is not completed yet."
            })
        }

        const users = await prisma.user.findMany()

        const scores = await prisma.matchScore.findMany({
            where: { matchId }
        })

        const picks = await prisma.playerPick.findMany({
            where: { matchId }
        })
        const allMatches = await prisma.match.findMany({
            where: { status: "COMPLETED" },
            orderBy: { matchNo: "asc" } // or date
        })

        const currentIndex = allMatches.findIndex(m => m.id === matchId)

        const previousMatchIds = allMatches
            .slice(0, currentIndex)
            .map(m => m.id)

        const result = await Promise.all(users.map(async (user) => {

            const score = scores.find(s => s.userId === user.id)
            const pick = picks.find(p => p.userId === user.id)

            // ✅ previous total
            const previousScores = await prisma.matchScore.findMany({
                where: {
                    userId: user.id,
                    matchId: { in: previousMatchIds }
                }
            })

            const previousTotal = previousScores.reduce((sum, s) => sum + s.points, 0)

            // ✅ DEFAULT CASE (THIS WAS MISSING)
            if (!pick || pick.status !== "APPROVED") {
                return {
                    userId: user.id,
                    name: user.name,

                    teamPicked: "-",
                    mom1: "-",
                    mom2: "-",

                    result: "LOSS",
                    isMomCorrect: false,
                    matchPoints: -10,
                    previousTotal,
                    total: previousTotal - 10,
                    streak: 0,
                }
            }

            // ✅ NORMAL CASE
            return {
                userId: user.id,
                name: user.name,

                teamPicked: pick.teamPickedId,
                mom1: pick.mom1Picked,
                mom2: pick.mom2Picked,

                result: score?.result || "LOSS",
                isMomCorrect: score?.isMomCorrect || false,
                matchPoints: score?.points ?? -10,
                previousTotal,
                total: previousTotal + (score?.points ?? -10),
                streak: score?.streak ?? 0,
            }
        }))

        res.json({
            match,
            scoreboard: result
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error fetching scoreboard" })
    }
})

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

