import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

/* ================= USERS ================= */

export async function getUser() {
    const { data, error } = await supabase.from("User").select("*");
    if (error) throw error;
    return data;
}

/* ================= TEAMS ================= */

type Team = {
    id: string;
    name: string;
    captain: string;
    shortName: string;
};

let teamsCache: Team[] | null = null;

export const getTeams = async (): Promise<Team[]> => {
    if (teamsCache) return teamsCache;

    const { data, error } = await supabase.from("Team").select("*");
    if (error) throw error;

    teamsCache = data;
    return data;
};

/* ================= MATCHES ================= */

export async function getMatch() {
    const { data, error } = await supabase
        .from("Match")
        .select("*")
        .order("matchNo", { ascending: true });

    if (error) throw error;
    return data;
}


export async function getUpcomingMatches() {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const todayISO = startOfToday.toISOString()

    // 1. STARTED matches
    const { data: started, error: err1 } = await supabase
        .from("Match")
        .select("*")
        .eq("status", "STARTED")
        .order("date", { ascending: true })
        .order("matchNo", { ascending: true })

    if (err1) throw err1

    // 2. Upcoming matches (excluding STARTED)
    const { data: upcoming, error: err2 } = await supabase
        .from("Match")
        .select("*")
        .gte("date", todayISO)
        .neq("status", "STARTED")
        .order("date", { ascending: true })
        .order("matchNo", { ascending: true })

    if (err2) throw err2

    // 3. Merge with priority
    const combined = [...started, ...upcoming]

    return combined.slice(0, 3)
}

// export async function getPlayersDetails() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//     })
//     return res.json()
// }
// export const getPlayersByTeams = async (teams: string[]) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/by-teams`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify({ teams }),
//     })

//     return res.json()
// }

/* ================= PLAYERS ================= */

export async function getPlayersDetails() {
    const { data, error } = await supabase.from("Player").select("*");
    if (error) throw error;
    return data;
}

export const getPlayersByTeams = async (teams: string[]) => {
    const { data, error } = await supabase
        .from("Player")
        .select("*")
        .in("teamShortName", teams);

    if (error) throw error;
    return data;
};

export async function signup(data: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return res.json();
}

// export async function login(data: any) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     });

//     return res.json();
// }

// export async function signup(data: any) {
//     const { email, name, password } = data;

//     const hashed = await bcrypt.hash(password, 10);

//     const { error } = await supabase.from("user").insert([
//         { email, name, password: hashed }
//     ]);

//     if (error) return { error: "User exists" };

//     return { success: true };
// }

export async function login(data: any) {
    const { login, password } = data;

    // same as: OR email OR name
    const { data: users, error } = await supabase
        .from("User")
        .select("*")
        .or(`email.eq.${login},name.eq.${login}`);

    if (error || !users || users.length === 0) {
        return { error: "User not found" };
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return { error: "Invalid password" };
    }

    // replace JWT with local session
    localStorage.setItem("user", JSON.stringify(user));

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    };
}

export const submitPicks = async (formData: any) => {
    // 1️⃣ Get logged-in user from localStorage
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(localUser, localUser.id);

    if (!localUser?.id) throw new Error("User not logged in");

    const submittedBy = localUser.id; // logged-in user submitting the picks

    // 2️⃣ Get selected user from dropdown (whose picks these are)
    const selectedUserName = formData.user;
    const { data: selectedUsers, error: selectedUserError } = await supabase
        .from("User")
        .select("id")
        .eq("name", selectedUserName)
        .limit(1);

    if (selectedUserError) throw selectedUserError;
    if (!selectedUsers || selectedUsers.length === 0) throw new Error("Selected user not found");

    const userId = selectedUsers[0].id; // whose picks these are

    // 3️⃣ Prepare pick entries
    const entries = Object.keys(formData)
        .filter((key) => key.startsWith("team_"))
        .map((key) => {
            const matchId = key.split("_")[1];
            return {
                playerPickId: null,
                userId,
                matchId,
                submittedBy,
                teamPickedId: formData[key],
                mom1Picked: formData[`mom1_${matchId}`] || null,
                mom2Picked: formData[`mom2_${matchId}`] || null,
                status: "PENDING",
            };
        });

    // 4️⃣ Insert into PickHistory
    const { error } = await supabase.from("PickHistory").insert(entries);
    if (error) throw error;

    return { success: true };
};
// export const submitPicks = async (formData: any) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/picks`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify(formData),
//     })

//     if (!res.ok) {
//         throw new Error("Failed to submit picks")
//     }

//     return res.json()
// }


export const submitSeasonPicks = async (formData: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/season-prediction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
    })

    if (!res.ok) {
        throw new Error("Failed to submit picks")
    }

    return res.json()
}

export async function getSeasonPrediction() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getTopBottomPrediction`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return res.json()
}

export async function getAllMatchPicks() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getMatchPicks`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return res.json()
}
export async function getLeaderboard() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`);
    return res.json();
}