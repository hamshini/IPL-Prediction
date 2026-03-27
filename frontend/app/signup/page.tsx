"use client"

import { useState } from "react"
import { signup } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSignup = async (e: any) => {
        e.preventDefault()

        const res = await signup({ email, name, password })

        if (res.error) {
            alert(res.error)
        } else {
            alert("Signup successful")
            router.push("/login")
        }
    }

    return (
        <form onSubmit={handleSignup} className="space-y-4 p-6">
            <input placeholder="Name" onChange={e => setName(e.target.value)} className="border p-2 w-full" />
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} className="border p-2 w-full" />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="border p-2 w-full" />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Sign Up
            </button>
        </form>
    )
}