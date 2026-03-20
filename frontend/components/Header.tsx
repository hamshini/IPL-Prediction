"use client"

import { getUser } from "@/lib/api"
import { useEffect, useState } from "react"

export default function Header() {

    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        getUser().then(setUser)
    }
        , [])
    return (

        <header className="bg-blue-700 text-white px-6 py-4 flex justify-between">

            <h1 className="text-xl font-bold">
                IPL Prediction 2026
            </h1>

            {user && (
                <div className="flex items-center gap-3">

                    <span>{user.name}</span>

                    <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center">
                        {user.name}
                    </div>

                </div>
            )}

        </header>

    )
}