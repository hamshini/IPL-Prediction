"use client"

import { getUser } from "@/lib/api"
import { get } from "http"
import { useEffect, useState } from "react"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        getUser().then(setUsers)
    }
        , [])

    return (
        <div style={{ padding: "20px" }}>
            <h1>Users</h1>

            {users.map((user) => (
                <div key={user.id}>
                    {user.name} - {user.email}
                </div>
            ))}
        </div>
    )
}