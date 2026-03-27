export async function getUser() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return res.json()
}
type Team = {
    id: string;
    name: string;
    captain: string;
    shortName: string;
};
let teamsCache: Team[] | null = null;

export const getTeams = async (): Promise<Team[]> => {
    if (teamsCache !== null) return teamsCache;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    const data = await res.json();

    teamsCache = data;
    return data;
}
export async function getMatch() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return res.json()
}
export async function getPlayersDetails() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return res.json()
}

export const getPlayersByTeams = async (teams: string[]) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/by-teams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ teams }),
    })

    return res.json()
}

export async function signup(data: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return res.json();
}

export async function login(data: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return res.json();
}

export const submitPicks = async (formData: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/picks`, {
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

export async function getUpcomingMatches() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/upcoming`, {
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