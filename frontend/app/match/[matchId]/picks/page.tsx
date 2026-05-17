"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function MatchPicksPage() {
    const { matchId } = useParams()
    const [picks, setPicks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPicks() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/matches/${matchId}/picks`
                )
                const data = await res.json()
                setPicks(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPicks()
    }, [matchId])

    if (loading) return <p className="p-6">Loading...</p>

    return (
        <div className="p-6">
            <h1 className="text-xl text-black font-semibold mb-4">
                Match Picks
            </h1>

            {picks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    ⏳ Waiting for admin to approve picks...
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">User</th>
                                    <th className="border p-2">Team</th>
                                    <th className="border p-2">MOM1</th>
                                    <th className="border p-2">MOM2</th>
                                    <th className="border p-2">submitted At</th>
                                    <th className="border p-2">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {picks.map((h) => (
                                    <tr key={h.id} className="text-center">
                                        <td className="border p-2">{h.user.name}</td>
                                        <td className="border p-2">{h.teamPickedId}</td>
                                        <td className="border p-2">{h.mom1Picked}</td>
                                        <td className="border p-2">{h.mom2Picked}</td>
                                        <td className="border p-2">
                                            {h.submittedAt
                                                ? new Date(h.submittedAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })
                                                : "-"}
                                        </td>
                                        <td className="border p-2">
                                            {h.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}