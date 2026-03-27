"use client"

import { useState } from "react"
import { login } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [loginInput, setLoginInput] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = async (e: any) => {
        e.preventDefault()

        const res = await login({
            login: loginInput,
            password
        })

        if (res.error) {
            alert(res.error)
        } else {
            // store token
            localStorage.setItem("token", res.token)
            localStorage.setItem("user", JSON.stringify(res.user))
            window.location.href = "/"

        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4 p-6">
            <input placeholder="Email or Username" onChange={e => setLoginInput(e.target.value)} className="border p-2 w-full" />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="border p-2 w-full" />

            <button className="bg-green-600 text-white px-4 py-2 rounded">
                Login
            </button>
        </form>
    )
}