"use client"

import { useEffect, useState } from "react"
import { getLeaderboard } from "@/lib/api"

export default function LeaderboardPage() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        getLeaderboard().then(setData)
    }, [])

    return (
        <div className="bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold text-black mb-4">Leaderboard</h1>

            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 text-black text-sm border-b">
                        <th className="p-2">Name</th>
                        <th className="p-2">Points</th>
                        <th className="p-2">Win %</th>
                        <th className="p-2">Last Match</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((p) => (
                        <tr key={p.name} className="border-b text-black">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2 font-bold">{p.totalPoints}</td>
                            <td className="p-2">{p.winPercent}%</td>
                            <td className="p-2">{p.latestResult}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}