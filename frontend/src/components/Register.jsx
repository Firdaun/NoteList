import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../lib/user-api";
import { alertError, alertInfo, alertSuccess } from "../lib/alert";

export default function Register() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const usernameRef = useRef(null)
    const nameRef = useRef(null)
    const passwordRef = useRef(null)
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const showPasswordWarning = () => {
        alertInfo("Jangan lupain passwordnya karena gak ada fitur reset password. Catet kalo perlu!");
    }

    const handleKeyDown = (e, prevRef, nextRef) => {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault()
            nextRef?.current?.focus()
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault()
            prevRef?.current?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.username || !formData.name || !formData.password) {
            if (!formData.username) return usernameRef.current.focus()
            if (!formData.name) return nameRef.current.focus()
            if (!formData.password) return passwordRef.current.focus()
            return
        }
        setIsLoading(true)
        try {
            await registerUser(formData)
            await alertSuccess("Registrasi berhasil! silahkan login.")
            navigate("/login")
        } catch (error) {
            alertError(error.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <Link to="/login"><svg className="absolute dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg></Link>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-fuchsia-400">Register</h1>
                <p className="text-gray-500 mt-2">Buat akun baru</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block dark:text-gray-300 text-sm font-semibold text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        ref={usernameRef}
                        onKeyDown={(e) => handleKeyDown(e, null, nameRef)}
                        value={formData.username}
                        onChange={handleChange}
                        type="text"
                        name="username"
                        placeholder="Masukkan username"
                        className="w-full dark:placeholder:text-gray-500 dark:text-gray-300 px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                    />
                </div>
                <div>
                    <label className="block dark:text-gray-300 text-sm font-semibold text-gray-700 mb-2">
                        Name
                    </label>
                    <input
                        ref={nameRef}
                        onKeyDown={(e) => handleKeyDown(e, usernameRef, passwordRef)}
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        name="name"
                        placeholder="Masukkan nama"
                        className="w-full dark:placeholder:text-gray-500 dark:text-gray-300 px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                    />
                </div>
                <div>
                    <label className="flex dark:text-gray-300 text-sm font-semibold text-gray-700 mb-2">
                        Password
                        <button className="ml-1 cursor-pointer" type="button">
                            <svg onClick={showPasswordWarning} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="oklch(74% 0.238 322.16)" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </button>
                    </label>
                    <input
                        ref={passwordRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(e);
                            } else {
                                handleKeyDown(e, nameRef, null);
                            }
                        }}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan password"
                        className="w-full dark:placeholder:text-gray-500 dark:text-gray-300 px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300 outline-none transition duration-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-fuchsia-400 hover:bg-fuchsia-500 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    {isLoading ? "Loading..." : "Register"}
                </button>
            </form>
        </>
    )
}