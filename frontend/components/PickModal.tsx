"use client"

import { getMatch, getUser, getPlayersByTeams } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function PickForm({ loggedUser }: { loggedUser: any }) {
    type Match = {
        id: number
        matchNo: number
        date: string
        teamAShortName: string
        teamBShortName: string
    }
    const { register, handleSubmit } = useForm()
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [matches, setMatches] = useState<Match[]>([])
    const [playersByMatch, setPlayersByMatch] = useState<Record<number, any[]>>({})
    const getRelevantMatches = () => {
        if (!matches.length) return []

        const today = new Date()
        today.setHours(0, 0, 0, 0)


        // Normalize match dates
        const sortedMatches = [...matches].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        // Group matches by date (YYYY-MM-DD)
        const grouped: Record<string, any[]> = {}

        sortedMatches.forEach(match => {
            const dateKey = new Date(match.date).toISOString().split("T")[0]
            if (!grouped[dateKey]) grouped[dateKey] = []
            grouped[dateKey].push(match)
        })

        const dates = Object.keys(grouped).sort()

        // Step 1: Check for today's matches
        const todayKey = today.toISOString().split("T")[0]
        if (grouped[todayKey]) {
            return grouped[todayKey]
        }

        // Step 2: Find next future match date
        for (let date of dates) {
            if (new Date(date) > today) {
                return grouped[date]
            }
        }

        return []
    }

    useEffect(() => {
        getUser().then(setUsers)
        getMatch().then(setMatches)
    }, [])
    useEffect(() => {
        if (!matches.length) return

        const relevantMatches = getRelevantMatches()

        relevantMatches.forEach(async (match: any) => {
            if (playersByMatch[match.id]) return
            const players = await getPlayersByTeams([
                match.teamAShortName,
                match.teamBShortName,
            ])

            setPlayersByMatch((prev) => ({
                ...prev,
                [match.id]: players,
            }))
        })
    }, [matches])

    const onSubmit = (data: any) => {
        console.log(data)
        router.back()
    }
    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
                <p className="text-sm text-gray-500">
                    Logged in user
                </p>

                <p className="font-medium">
                    {loggedUser.email}
                </p>
            </div>

            <div>
                <label>User</label>

                <select
                    {...register("username")}
                    className="border p-2 rounded w-full"
                    defaultValue={loggedUser.name}
                >

                    {users.map((user: any) => (
                        <option key={user.id} value={user.name}>
                            {user.name}
                        </option>
                    ))}

                </select>
            </div>

            {getRelevantMatches().map((match: any) => (

                <div key={match.id} className="border p-4 rounded space-y-3">

                    <p className="font-semibold">
                        Match {match.matchNo}
                    </p>

                    <p className="text-sm text-gray-500">
                        {new Date(match.date).toLocaleDateString()}
                    </p>

                    <div>

                        <label className="block">Choose Team</label>

                        <label className="mr-4">

                            <input
                                type="radio"
                                value={match.teamAShortName}
                                {...register(`team_${match.id}`, { required: true })}
                            />

                            {match.teamAShortName}

                        </label>

                        <label>

                            <input
                                type="radio"
                                value={match.teamBShortName}
                                {...register(`team_${match.id}`)}
                            />

                            {match.teamBShortName}

                        </label>

                    </div>


                    {/* MOM1 */}

                    <select
                        {...register(`mom1_${match.id}`)}
                        className="border p-2 rounded w-full"
                    >

                        {(playersByMatch[match.id] || []).map((player: any) => (
                            <option key={player.id} value={player.name}>
                                {player.name}
                            </option>
                        ))}

                    </select>

                    <select
                        {...register(`mom2_${match.id}`)}
                        className="border p-2 rounded w-full"
                    >

                        {(playersByMatch[match.id] || []).map((player: any) => (
                            <option key={player.id}>
                                {player.name}
                            </option>
                        ))}

                    </select>

                </div>

            ))}


            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Submit Picks
            </button>

        </form>

    )
}
