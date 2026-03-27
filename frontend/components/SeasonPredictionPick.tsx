"use client"

import { useEffect, useMemo, useState } from "react"
import { getUser, getTeams, getPlayersDetails, submitSeasonPicks } from "@/lib/api"
import { useRouter } from "next/navigation"
import MySelect from "@/components/styles/Myselect"
export default function SeasonPredictionForm({ loggedUser }: { loggedUser: any }) {

    const [users, setUsers] = useState<any[]>([])
    const [teams, setTeams] = useState<any[]>([])
    const [players, setPlayers] = useState<any[]>([])
    // const [search, setSearch] = useState("")
    const router = useRouter()

    const [formData, setFormData] = useState<any>({
        userId: loggedUser.id,
        topTeams: [],
        bottomTeams: [],
        orangeCaps: [],
        purpleCaps: [],
    })

    useEffect(() => {
        getUser().then(setUsers)
        getTeams().then(setTeams)
        getPlayersDetails().then(setPlayers)
    }, [])

    // ✅ SORT PLAYERS
    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => a.name.localeCompare(b.name))
    }, [players])

    // // ✅ SEARCH FILTER
    // const filteredPlayers = useMemo(() => {
    //     return sortedPlayers.filter(p =>
    //         p.name.toLowerCase().includes(search.toLowerCase())
    //     )
    // }, [search, sortedPlayers])
    const playerOptions = useMemo(() => {
        return [...players]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(p => ({
                value: p.name,
                label: p.name
            }))
    }, [players])

    // ✅ MULTI SELECT HANDLER
    const toggleSelection = (key: string, value: string, limit: number) => {
        const current = formData[key]

        if (current.includes(value)) {
            setFormData({
                ...formData,
                [key]: current.filter((v: string) => v !== value)
            })
        } else {
            if (current.length >= limit) return
            setFormData({
                ...formData,
                [key]: [...current, value]
            })
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (formData.topTeams.length !== 4) return alert("Select 4 top teams")
        if (formData.bottomTeams.length !== 2) return alert("Select 2 bottom teams")
        if (formData.orangeCaps.length !== 3) return alert("Select 3 orange cap players")
        if (formData.purpleCaps.length !== 3) return alert("Select 3 purple cap players")

        // ✅ Convert to backend format
        const payload = {
            userId: formData.userId,

            top1TeamId: String(formData.topTeams[0]),
            top2TeamId: String(formData.topTeams[1]),
            top3TeamId: String(formData.topTeams[2]),
            top4TeamId: String(formData.topTeams[3]),

            bottom1TeamId: String(formData.bottomTeams[0]),
            bottom2TeamId: String(formData.bottomTeams[1]),

            orangeCap1: formData.orangeCaps[0],
            orangeCap2: formData.orangeCaps[1],
            orangeCap3: formData.orangeCaps[2],

            purpleCap1: formData.purpleCaps[0],
            purpleCap2: formData.purpleCaps[1],
            purpleCap3: formData.purpleCaps[2],
        }

        try {
            const result = await submitSeasonPicks(payload)
            console.log(result)

            alert("Submitted successfully!")
            router.back()
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* USER */}
            <MySelect
                value={formData.userId}
                onChange={(e: any) => setFormData({ ...formData, userId: e.target.value })}
            >
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </MySelect>

            {/* TOP 4 */}
            <div>
                <h3>Top 4 Teams</h3>
                <div className="flex flex-wrap gap-2">
                    {teams.map(team => {
                        const selected = formData.topTeams.includes(team.id)
                        // const disabled = formData.bottomTeams.includes(team.id)

                        return (
                            <button
                                type="button"
                                key={team.id}
                                // disabled={disabled}
                                onClick={() => toggleSelection("topTeams", team.id, 4)}
                                className={`px-3 py-1 border rounded 
                                    ${selected ? "bg-green-500 text-white" : ""}
                                   
                                `}
                            >
                                {team.shortName}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* BOTTOM 2 */}
            <div>
                <h3>Bottom 2 Teams</h3>
                <div className="flex flex-wrap gap-2">
                    {teams.map(team => {
                        const selected = formData.bottomTeams.includes(team.id)
                        // const disabled = formData.topTeams.includes(team.id)

                        return (
                            <button
                                type="button"
                                key={team.id}
                                // disabled={disabled}
                                onClick={() => toggleSelection("bottomTeams", team.id, 2)}
                                className={`px-3 py-1 border rounded 
                                    ${selected ? "bg-red-500 text-white" : ""}
                                  
                                `}
                            >
                                {team.shortName}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ORANGE CAP */}
            <div>
                <h3>Orange Cap (3)</h3>

                <MySelect
                    options={playerOptions}
                    isMulti
                    value={playerOptions.filter(p =>
                        formData.orangeCaps.includes(p.value)
                    )}
                    onChange={(selected: any) => {
                        if (selected.length > 3) return
                        setFormData({
                            ...formData,
                            orangeCaps: selected.map((s: any) => s.value)
                        })
                    }}
                />
            </div>

            {/* PURPLE CAP */}
            <div>
                <h3>Purple Cap (3)</h3>

                <MySelect
                    options={playerOptions}
                    isMulti
                    value={playerOptions.filter(p =>
                        formData.purpleCaps.includes(p.value)
                    )}
                    onChange={(selected: any) => {
                        if (selected.length > 3) return
                        setFormData({
                            ...formData,
                            purpleCaps: selected.map((s: any) => s.value)
                        })
                    }}
                />
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit Prediction
            </button>
        </form>
    )
}