"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {

    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        router.push("/login")
    }

    return (
        <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">

            <h1
                className="text-xl font-bold text-black cursor-pointer"
                onClick={() => router.push("/")}
            >
                IPL Prediction 2026
            </h1>

            {user ? (
                <div className="flex items-center gap-4">

                    {/* Username */}
                    <span>{user.name || user.email}</span>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold">
                        {(user.name || user.email)[0].toUpperCase()}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="bg-red-500 px-3 py-1 rounded"
                    >
                        Logout
                    </button>

                </div>
            ) : (
                <div className="flex gap-3">

                    <button
                        onClick={() => router.push("/login")}
                        className="bg-white text-blue-700 px-3 py-1 rounded"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => router.push("/signup")}
                        className="bg-green-500 px-3 py-1 rounded"
                    >
                        Signup
                    </button>

                </div>
            )}

        </header>
    )
}