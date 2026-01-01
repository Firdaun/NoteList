import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router"
import { getUser } from "../lib/user-api"

export const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        getUser()
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center bg-fuchsia-50 justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-fuchsia-200 border-t-fuchsia-400 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium animate-pulse">
                        Memeriksa akses...
                    </span>
                </div>
            </div>
        )
    }

    if (!isAuth) {
        return <Navigate to='/login' replace />
    }

    return children || <Outlet />
}

export const GuestRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        getUser()
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return null

    if (isAuth) {
        return <Navigate to='/' replace />
    }

    return children || <Outlet />
}