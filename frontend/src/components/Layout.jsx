import { Outlet } from "react-router"
import Navbar from "./Navbar"
import { getUser } from "../lib/user-api"
import { useEffect, useState } from "react"

export default function Layout() {
    const [user, setUser] = useState(null)

    const fetchUser = async () => {
        try {
            const result = await getUser()
            setUser(result.data)
        } catch (error) {
            console.error("Gagal ambil user", error)
            setUser(null)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])
    return (
        <>
            <Navbar user={user} />
            <main>
                <Outlet context={{user, refreshUser: fetchUser}} />
            </main>
        </>
    )
}