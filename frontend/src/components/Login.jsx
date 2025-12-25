import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../lib/user-api";
import { alertError, alertSuccess } from "../lib/alert";

export default function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleKeyDown = (e, prevRef, nextRef) => {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault()
            nextRef?.current?.focus()
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            prevRef?.current?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.username || !formData.password) {
            if (!formData.username) return usernameRef.current.focus()
            if (!formData.password) return passwordRef.current.focus()
            return
        }
        setIsLoading(true)
        try {
            await loginUser(formData)
            navigate('/')
        } catch (error) {
            alertError(error.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-fuchsia-50">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-fuchsia-400">Selamat datang</h1>
                        <p className="text-gray-500 mt-2">Masuk untuk bisa akses catetanmu.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                ref={usernameRef} // Pasang Ref
                                onKeyDown={(e) => handleKeyDown(e, null, passwordRef)}
                                value={formData.username}
                                onChange={handleChange}
                                type="text"
                                name="username"
                                placeholder="Masukkan username"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmit(e);
                                    } else {
                                        handleKeyDown(e, usernameRef, null);
                                    }
                                }}
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                name="password"
                                placeholder="Masukkan password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-fuchsia-400 hover:bg-fuchsia-500 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {isLoading ? "Loading..." : "Masuk"}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Tidak punya akun?{' '}
                        <Link to="/register" className="font-semibold text-fuchsia-400 hover:text-fuchsia-500 hover:underline transition duration-200">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}