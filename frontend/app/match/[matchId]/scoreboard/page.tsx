"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function MatchScoreboard() {
    const { matchId } = useParams()

    const [data, setData] = useState<any[]>([])
    const [match, setMatch] = useState<any>(null)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/match/${matchId}/scoreboard`)
            .then(res => res.json())
            .then((res) => {
                setMatch(res.match)
                setData(res.scoreboard)
            })
    }, [matchId])

    if (!match) return <p>Loading...</p>

    return (
        <div className="p-6">

            {/* ✅ MATCH RESULT HEADER */}
            <h1 className="text-xl text-black font-bold mb-2">
                {match.winningTeamId} won
            </h1>

            <p className="mb-4 text-gray-600">
                MoM: {match.manOfMatch}
            </p>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full text-left border-collapse">

                    <thead className="bg-gray-100 text-sm text-gray-600">
                        <tr>
                            <th className="p-3">Player</th>
                            <th className="p-3">Team Picked</th>
                            <th className="p-3">MOM1</th>
                            <th className="p-3">MOM2</th>
                            <th className="p-3">Result</th>
                            <th className="p-3">Match Points</th>
                            <th className="p-3">Previous</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Streak</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((p) => (
                            <tr key={p.userId} className="border-t">

                                <td className="p-3 font-medium">{p.name}</td>

                                <td className="p-3">{p.teamPicked}</td>

                                <td className="p-3">{p.mom1 || "-"}</td>

                                <td className="p-3">{p.mom2 || "-"}</td>

                                <td className="p-3">
                                    {p.result === "WIN" ? "✅ Win" : "❌ Loss"}
                                </td>

                                <td className="p-3">{p.matchPoints}</td>

                                <td className="p-3">{p.previousTotal}</td>

                                <td className="p-3 font-bold">{p.total}</td>

                                <td className="p-3">🔥 {p.streak}</td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}