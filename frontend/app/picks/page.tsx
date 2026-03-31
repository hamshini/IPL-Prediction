"use client"

import PickForm from "@/components/PickModal"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PicksPage() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    if (!user) {
        return <p className="p-6">Please login first</p>
    }
    return (
        <div className="p-6">
            <div className="P-6 text-gray-500">
                <button
                    onClick={() => router.back()}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
            </div>
            <PickForm
                loggedUser={user}
            // onClose={() => window.history.back()}
            />
        </div>
    )
}