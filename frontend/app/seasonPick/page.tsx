"use client"

import SeasonPredictionForm from "@/components/SeasonPredictionPick"
import { useEffect, useState } from "react"

export default function SeasonPicksPage() {
    const [user, setUser] = useState<any>(null)

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
            <SeasonPredictionForm
                loggedUser={user}
            />
        </div>
    )
}