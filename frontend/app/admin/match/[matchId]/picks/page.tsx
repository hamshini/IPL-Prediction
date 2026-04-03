"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function AdminPicksPage() {
    const { matchId } = useParams()
    const [picks, setPicks] = useState<any[]>([])

    useEffect(() => {
        if (!matchId) return

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/match/${matchId}/picks`)
            .then(res => res.json())
            .then(setPicks)
    }, [matchId])

    const approve = async (pickId: string) => {
        const token = localStorage.getItem("token");

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pick/approve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // ✅ REQUIRED
            },
            body: JSON.stringify({ historyId: pickId }),
        });

        location.reload();
    };

    const reject = async (pickId: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pick/reject`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ historyId: pickId }),
        })
        location.reload()
    }

    // ✅ FILTER (like Excel search)
    // const filtered = picks?.filter((h) =>
    //     h.user?.name?.toLowerCase().includes(filter.toLowerCase())
    // )

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-black mb-4">Match Picks</h1>

            {/* 🔍 FILTER */}
            {/* <input
                placeholder="Filter by user..."
                className="border px-3 py-2 mb-4 w-64 rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            /> */}

            {/* 📊 TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">User</th>
                            <th className="border p-2">Team</th>
                            <th className="border p-2">MOM1</th>
                            <th className="border p-2">MOM2</th>
                            <th className="border p-2">Time</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
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
                                    {new Date(h.modifiedAt).toLocaleString()}
                                </td>

                                <td className="border p-2">
                                    {h.status}
                                </td>

                                {/* ✅ ACTIONS */}
                                <td className="border p-2 space-x-2">
                                    <button
                                        onClick={() => approve(h.id)}
                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => reject(h.id)}
                                        className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}