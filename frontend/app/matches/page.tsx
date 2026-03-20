"use client"

import { useEffect, useState } from "react"

export default function MatchesPage() {
    const [matches, setMatches] = useState<any[]>([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`)
            .then(res => res.json())
            .then(setMatches)
    }, [])

    return (
        <div className="space-y-6">

            <h1 className="text-xl font-bold">All Matches</h1>

            {/* MOBILE VIEW */}
            <div className="space-y-4 md:hidden">

                {matches.map((match) => (

                    <div
                        key={match.id}
                        className="bg-white rounded-lg shadow p-4"
                    >

                        <div className="flex justify-between items-center">

                            <p className="text-sm text-gray-500">
                                Match {match.matchNo}
                            </p>

                            <p className="text-sm text-gray-500">
                                {new Date(match.scheduledStart).toLocaleDateString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    day: "numeric",
                                    month: "short"
                                })}
                            </p>

                        </div>

                        <p className="text-lg font-semibold mt-2">
                            {match.teamAShortName} vs {match.teamBShortName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            {match.venue}
                        </p>

                        <p className="text-sm text-gray-500">
                            {new Date(match.scheduledStart).toLocaleTimeString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                hour: "numeric",
                                minute: "2-digit"
                            })}
                        </p>

                    </div>

                ))}

            </div>


            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white rounded shadow">

                <table className="w-full text-left">

                    <thead className="border-b">

                        <tr className="text-sm text-gray-500">

                            <th className="p-3">Match</th>
                            <th className="p-3">Teams</th>
                            <th className="p-3">Venue</th>
                            <th className="p-3">Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {matches.map((match) => (

                            <tr key={match.id} className="border-b">

                                <td className="p-3">{match.matchNo}</td>

                                <td className="p-3 font-medium">
                                    {match.teamAShortName} vs {match.teamBShortName}
                                </td>

                                <td className="p-3">{match.venue}</td>

                                <td className="p-3">

                                    {new Date(match.scheduledStart).toLocaleString("en-IN", {
                                        timeZone: "Asia/Kolkata",
                                        day: "numeric",
                                        month: "short",
                                        hour: "numeric",
                                        minute: "2-digit"
                                    })}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}