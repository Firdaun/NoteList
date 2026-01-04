import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-fuchsia-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200 relative">
                <Outlet />
            </div>
        </div>
    )
}