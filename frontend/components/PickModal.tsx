"use client"

import { useEffect, useState, useMemo } from "react"
import { getMatch, getPlayersByTeams, getUser, submitPicks } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function PickForm({ loggedUser }: { loggedUser: any }) {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([]) // all users
    const [matches, setMatches] = useState<any[]>([])
    const [playersByMatch, setPlayersByMatch] = useState<Record<number, any[]>>({})
    const [formData, setFormData] = useState<any>({
        user: loggedUser.name,
    })

    // Redirect if no token
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
        }
    }, [])

    // Load users
    useEffect(() => {
        getUser().then(setUsers)
    }, [])

    // Load matches
    useEffect(() => {
        getMatch().then(setMatches)
    }, [])

    // Load players for relevant matches
    useEffect(() => {
        relevantMatches.forEach(async (match) => {

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
    }, [matches, users]) // include users so that relevantMatches triggers correctly if needed

    // Optimized relevant matches
    const relevantMatches = useMemo(() => {
        if (!matches.length) return []

        const getLocalDateKey = (date: string | Date) => {
            const d = new Date(date)
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, "0")
            const day = String(d.getDate()).padStart(2, "0")
            return `${year}-${month}-${day}`
        }

        const todayKey = getLocalDateKey(new Date())

        const sorted = [...matches].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        const grouped: Record<string, any[]> = {}

        sorted.forEach((match) => {
            const key = getLocalDateKey(match.date)
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(match)
        })

        // ✅ 1. TODAY matches (ALL of them)
        if (grouped[todayKey]) {
            return grouped[todayKey]
        }

        // ✅ 2. NEXT upcoming date
        const futureDates = Object.keys(grouped)
            .filter((date) => date > todayKey) // ✅ FIXED
            .sort()

        if (futureDates.length > 0) {
            return grouped[futureDates[0]]
        }

        return []
    }, [matches])
    // Handle form changes
    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value,
        }))
    }

    // Handle submit
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            const result = await submitPicks(formData)
            console.log(result)

            alert("Picks submitted successfully!")
            router.back()
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Logged in user */}
            <div>
                <p className="text-sm text-gray-500">Logged in user</p>
                <p className="font-medium">{loggedUser.email}</p>
            </div>

            {/* Username dropdown */}
            <div>
                <label className="block mb-1">Select User</label>
                <select
                    value={formData.user}
                    onChange={(e) => handleChange("user", e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.name}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Matches */}
            {relevantMatches.map((match) => (
                <div key={match.id} className="border p-4 rounded space-y-3">

                    <p className="font-semibold">Match {match.matchNo}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(match.date).toLocaleDateString()}
                    </p>

                    {/* Teams */}
                    <div>
                        <label className="mr-4">
                            <input
                                type="radio"
                                name={`team_${match.id}`}
                                value={match.teamAShortName}
                                checked={formData[`team_${match.id}`] === match.teamAShortName}
                                onChange={(e) =>
                                    handleChange(`team_${match.id}`, e.target.value)
                                }
                            />
                            {match.teamAShortName}
                        </label>

                        <label>
                            <input
                                type="radio"
                                name={`team_${match.id}`}
                                value={match.teamBShortName}
                                checked={formData[`team_${match.id}`] === match.teamBShortName}
                                onChange={(e) =>
                                    handleChange(`team_${match.id}`, e.target.value)
                                }
                            />
                            {match.teamBShortName}
                        </label>
                    </div>

                    {/* MOM1 */}
                    <select
                        value={formData[`mom1_${match.id}`] || ""}
                        onChange={(e) => handleChange(`mom1_${match.id}`, e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select MOM 1</option>
                        {(playersByMatch[match.id] || []).map((player: any) => (
                            <option key={player.id} value={player.name}>
                                {player.name}
                            </option>
                        ))}
                    </select>

                    {/* MOM2 */}
                    <select
                        value={formData[`mom2_${match.id}`] || ""}
                        onChange={(e) => handleChange(`mom2_${match.id}`, e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select MOM 2</option>
                        {(playersByMatch[match.id] || []).map((player: any) => (
                            <option key={player.id} value={player.name}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit Picks
            </button>
        </form>
    )
}