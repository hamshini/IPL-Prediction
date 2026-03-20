import express from "express";
import { prisma } from "./lib/prisma";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://ipl-prediction-frontend.vercel.app/"
    ]
}))

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post("/users", async (req, res) => {
    const { email, name, role } = req.body;
    const user = await prisma.user.create({
        data: { email, name, role },
    });
    res.json(user);
});

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
app.post("/teams", async (req, res) => {
    const { name, shortName, captain } = req.body;
    const team = await prisma.team.create({
        data: { name, shortName, captain },
    });
    res.json(team);
});

// Matches
app.get("/matches", async (req, res) => {
    const matches = await prisma.match.findMany();
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

    const matches = await prisma.match.findMany({
        where: {
            date: {
                gte: new Date(),
            },
        },
        orderBy: {
            date: "asc",
        },
        take: 3,
    })

    res.json(matches)
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

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});