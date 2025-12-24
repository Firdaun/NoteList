import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { getUser } from "../lib/user-api";
import { useEffect, useState } from "react";

export default function Layout() {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const result = await getUser(token);
                setUser(result.data);
            } catch (error) {
                console.error("Gagal ambil user", error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <>
            <Navbar user={user} />
            <main>
                <Outlet context={{refreshUser: fetchUser}} />
            </main>
        </>
    )
}