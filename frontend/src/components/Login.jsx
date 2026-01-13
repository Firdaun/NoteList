import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../lib/user-api";
import { alertError } from "../lib/alert";

export default function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const [failedAttempts, setFailedAttempts] = useState(0)
    const [banEndTime, setBanEndTime] = useState(null)
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        const storedBanTime = localStorage.getItem('login_ban_time')
        if (storedBanTime) {
            const endTime = parseInt(storedBanTime, 10)
            if (endTime > Date.now()) {
                setBanEndTime(endTime)
                updateTimer(endTime)
            } else {
                localStorage.removeItem('login_ban_time')
            }
        }
    }, [])

    const updateTimer = (endTime) => {
        const now = Date.now()
        const distance = endTime - now

        if (distance <= 0) {
            setBanEndTime(null)
            setFailedAttempts(0)
            setTimeLeft("")
            localStorage.removeItem('login_ban_time')
            return false
        } else {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setTimeLeft(`${minutes}m ${seconds}s`)
            return true
        }
    }

    useEffect(() => {
        let interval;
        if (banEndTime) {
            updateTimer(banEndTime)

            interval = setInterval(() => {
                const stillBanned = updateTimer(banEndTime)
                if (!stillBanned) {
                    clearInterval(interval)
                }
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [banEndTime])

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
            localStorage.removeItem('login_ban_time')
            navigate('/')
        } catch (error) {
            if (error.status === 429) {
                const waitSeconds = error.retryAfter || 30
                const banDuration = waitSeconds * 1000
                const endTime = Date.now() + banDuration

                setBanEndTime(endTime)
                localStorage.setItem('login_ban_time', endTime)
                alertError(`Terlalu banyak percobaan. Tunggu ${waitSeconds} detik.`)
            } else {
                setFailedAttempts(prev => prev + 1)
                alertError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isBanned = banEndTime !== null

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-fuchsia-400">Selamat datang</h1>
                <p className="text-gray-500 mt-2">Masuk untuk bisa akses catetanmu.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block dark:text-gray-300 text-sm font-semibold text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        disabled={isBanned}
                        ref={usernameRef}
                        onKeyDown={(e) => handleKeyDown(e, null, passwordRef)}
                        value={formData.username}
                        onChange={handleChange}
                        type="text"
                        name="username"
                        placeholder="Masukkan username"
                        className="w-full dark:text-gray-300 px-4 py-3 rounded-lg border dark:placeholder:text-gray-500 border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                    />
                </div>
                <div>
                    <label className="block dark:text-gray-300 text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        disabled={isBanned}
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
                        className="w-full dark:text-gray-300 px-4 py-3 rounded-lg border dark:placeholder:text-gray-500 border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                    />

                    <div className="mt-2 text-sm">
                        {isBanned ? (
                            <p className="text-red-500 font-bold animate-pulse">
                                ⛔ Diblokir sementara. Coba lagi dalam: {timeLeft}
                            </p>
                        ) : (
                            failedAttempts > 0 && (
                                <p className="text-orange-500">
                                    ⚠️ Password salah. Sisa kesempatan: <span className="font-bold">{6 - failedAttempts}</span>
                                </p>
                            )
                        )}
                    </div>

                </div>
                <button
                    type="submit"
                    disabled={isLoading || isBanned}
                    className="w-full bg-fuchsia-400 hover:bg-fuchsia-500 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    {isLoading ? "Loading..." : isBanned ? "Tunggu Timer Habis" : "Masuk"}
                </button>
            </form>
            <p className="mt-8 text-center dark:text-gray-300 text-sm text-gray-600">
                Tidak punya akun?{' '}
                <Link to="/register" className="font-semibold text-fuchsia-400 hover:text-fuchsia-500 hover:underline transition duration-200">
                    Register
                </Link>
            </p>
        </>
    )
}