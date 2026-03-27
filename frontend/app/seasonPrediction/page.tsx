"use client"

import { useEffect, useState } from "react"
import { getSeasonPrediction, getTeams, getUser } from "@/lib/api"

export default function SeasonPredictionPage() {
    const [predictions, setPredictions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [teamMap, setTeamMap] = useState<any>({})
    const [userMap, setUserMap] = useState<any>({})

    useEffect(() => {
        Promise.all([
            getSeasonPrediction(),
            getTeams(),
            getUser()
        ])
            .then(([predData, teamData, userData]) => {

                setPredictions(predData)

                // Create team map
                const tMap: any = {}
                teamData.forEach((team: any) => {
                    tMap[String(team.id)] = team.shortName
                })
                setTeamMap(tMap)

                // Create user map
                const uMap: any = {}
                userData.forEach((user: any) => {
                    uMap[String(user.id)] = user.name
                })
                setUserMap(uMap)

                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>
    const formatList = (items: any[]) => {
        return items.filter(Boolean).join(", ")
    }
    return (
        <div className="space-y-6">

            <h1 className="text-xl text-black font-bold">Season Predictions</h1>

            {/* MOBILE */}
            <div className="space-y-4 md:hidden">

                {predictions.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded shadow">

                        <p className="text-sm text-gray-500">
                            User: {userMap[p.userId] || p.userId.slice(0, 6)}
                        </p>

                        <div className="mt-2">
                            <p className="font-semibold text-green-600">
                                Top 4 Teams
                            </p>
                            <p>
                                {formatList([
                                    teamMap[String(p.top1TeamId)],
                                    teamMap[String(p.top2TeamId)],
                                    teamMap[String(p.top3TeamId)],
                                    teamMap[String(p.top4TeamId)]
                                ])}
                            </p>
                        </div>

                        <div className="mt-2">
                            <p className="font-semibold text-red-600">
                                Bottom Teams
                            </p>
                            <p>
                                {formatList([
                                    teamMap[String(p.bottom1TeamId)],
                                    teamMap[String(p.bottom2TeamId)]
                                ])}
                            </p>
                        </div>

                        <div className="mt-2">
                            <p className="font-semibold text-orange-500">
                                Orange Cap
                            </p>
                            <p>
                                {formatList([
                                    p.orangeCap1,
                                    p.orangeCap2,
                                    p.orangeCap3
                                ])}
                            </p>
                        </div>

                        <div className="mt-2">
                            <p className="font-semibold text-purple-500">
                                Purple Cap
                            </p>
                            <p>
                                {formatList([
                                    p.purpleCap1,
                                    p.purpleCap2,
                                    p.purpleCap3
                                ])}
                            </p>
                        </div>

                    </div>
                ))}

            </div>

            {/* DESKTOP */}
            <div className="hidden md:block bg-white rounded shadow overflow-x-auto">

                <table className="w-full text-left text-sm">

                    <thead className="border-b text-black">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Top 4</th>
                            <th className="p-3">Bottom</th>
                            <th className="p-3">Orange Cap</th>
                            <th className="p-3">Purple Cap</th>
                        </tr>
                    </thead>

                    <tbody>
                        {predictions.map((p) => (
                            <tr key={p.id} className="border-b text-black">

                                <td className="p-3">
                                    {userMap[p.userId] || p.userId.slice(0, 6)}
                                </td>

                                <td className="p-3">
                                    {formatList([
                                        teamMap[String(p.top1TeamId)],
                                        teamMap[String(p.top2TeamId)],
                                        teamMap[String(p.top3TeamId)],
                                        teamMap[String(p.top4TeamId)]
                                    ])}
                                </td>

                                <td className="p-3">
                                    {formatList([
                                        teamMap[String(p.bottom1TeamId)],
                                        teamMap[String(p.bottom2TeamId)]
                                    ])}
                                </td>
                                <td className="p-3">
                                    {formatList([
                                        p.orangeCap1,
                                        p.orangeCap2,
                                        p.orangeCap3
                                    ])}
                                </td>

                                <td className="p-3">
                                    {formatList([
                                        p.purpleCap1,
                                        p.purpleCap2,
                                        p.purpleCap3
                                    ])}
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    )
}