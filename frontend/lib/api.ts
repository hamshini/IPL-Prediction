export async function getUser() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
    return res.json()
}
export async function getMatch() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
    return res.json()
}
export async function getPlayersDetails() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`)
    return res.json()
}

export const getPlayersByTeams = async (teams: string[]) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/by-teams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ teams }),
    })

    return res.json()
}
