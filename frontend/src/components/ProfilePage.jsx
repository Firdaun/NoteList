import { Link, useNavigate, useOutletContext } from "react-router";
import { alertConfirm, alertError, alertInfo, alertSuccess } from "../lib/alert";
import { deleteUser, logout, logoutAPI, updateUser } from "../lib/user-api";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, refreshUser } = useOutletContext()
    const [name, setName] = useState(user?.name || "")
    const [isProfileLoading, setIsProfileLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [originalName, setOriginalName] = useState(user?.name || "")
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const newPasswordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const [passwordForm, setPasswordForm] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const showPasswordWarning = () => {
        alertInfo("Jangan lupain passwordnya karena gak ada fitur reset password. Catet kalo perlu!");
    }

    const queryClient = useQueryClient()

    useEffect(() => {
        if (user) {
            setName(user.name)
            setOriginalName(user.name)
        }
    }, [user])

    const handleKeyDown = (e, prevRef, nextRef) => {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault()
            nextRef?.current?.focus()
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            prevRef?.current?.focus()
        }
    }

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            return alertError('Nama tidak boleh kosong')
        }
        if (name === originalName) {
            return alertError("⚠️ Nama kamu tidak berubah dari sebelumnya.");
        }
        setIsProfileLoading(true)
        try {
            await updateUser({ name: name })
            setOriginalName(name)
            if (refreshUser) refreshUser()
            await alertSuccess('Nama berhasil diperbarui!')
        } catch (error) {
            alertError(error.message)
        } finally {
            setIsProfileLoading(false)
        }
    }

    const handleUpdatePassword = async () => {
        const { newPassword, confirmPassword } = passwordForm

        if (!newPassword || !confirmPassword) {
            if (!newPassword) return newPasswordRef.current.focus()
            if (!confirmPassword) return confirmPasswordRef.current.focus()
            return
        }
        if (newPassword !== confirmPassword) {
            return alertError('Konfirmasi password tidak cocok!')
        }
        if (newPassword.length < 6) {
            return alertError('Password minimal 6 karakter')
        }

        setIsPasswordLoading(true)

        try {
            await updateUser({ password: newPassword })
            await alertSuccess('Password berhasil diganti!')

            setPasswordForm({ newPassword: '', confirmPassword: '' })
        } catch (error) {
            alertError(error.message)
        } finally {
            setIsPasswordLoading(false)
        }
    }

    const handleLogout = async () => {
        const isConfirmed = await alertConfirm('Apakah kamu yakin ingin keluar')
        if (!isConfirmed) return
        setIsLoggingOut(true)
        try {
            await logoutAPI()
        } catch (error) {
            console.error('Gagal logout', error)
        } finally {
            logout()
            queryClient.removeQueries()
            navigate('/login')
        }
    }

    const handleDeleteAccount = async () => {
        const isConfirmed = await alertConfirm('Apakah kamu yakin ingin menghapus akunmu? Tindakan ini tidak dapat dibatalkan.')
        if (!isConfirmed) return
        setIsDeletingAccount(true)
        try {
            await deleteUser()
            logout()
            queryClient.removeQueries()
            await alertSuccess('Akun berhasil dihapus.')
            navigate('/register')
        } catch (error) {
            isDeletingAccount(false)
            alertError(error.message)
        }
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 relative overflow-hidden">

            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 right-[-10%] w-96 h-96 bg-fuchsia-200 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 left-[-10%] w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="max-w-5xl w-[90%] mx-auto pt-10">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/" className=" text-gray-400 hover:text-fuchsia-500 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300">Profil Kamu</h1>
                            <p className="text-gray-500 text-sm">Atur informasi pribadi dan keamanan akunmu.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dashed border-gray-100">
                                <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-500 dark:bg-fuchsia-200 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-bold dark:text-gray-300 text-gray-800">Edit Profil</h2>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Nama Lengkap</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    handleUpdateProfile()
                                                }
                                            }}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                            className="w-full dark:text-gray-300 pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-800 border-2 border-gray-100 rounded-2xl text-gray-700 focus:outline-none focus:border-fuchsia-300 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button onClick={handleUpdateProfile} disabled={isProfileLoading} className="w-full py-3 px-4 bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-200 dark:shadow-gray-800 hover:shadow-fuchsia-300 dark:hover:shadow-gray-800 transition-all cursor-pointer flex justify-center items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                    {isProfileLoading ? "Menyimpan..." : "Update Profil"}
                                </button>
                            </div>
                            <div className="mt-5">
                                <button onClick={handleLogout} className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-gray-800 hover:shadow-red-300 dark:hover:shadow-gray-800 transition-all cursor-pointer flex justify-center items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path></svg>
                                    Logout
                                </button>
                            </div>
                            <div className="mt-5">
                                <button onClick={handleDeleteAccount} disabled={isDeletingAccount} className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-gray-800 hover:shadow-red-300 dark:hover:shadow-gray-800 transition-all cursor-pointer flex justify-center items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path></svg>
                                    {isDeletingAccount ? "Menghapus..." : "Hapus Akun"}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dashed border-gray-100">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-200 text-purple-500 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold dark:text-gray-300 text-gray-800">Ganti Password</h2>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Password Baru</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            ref={newPasswordRef}
                                            onKeyDown={(e) => handleKeyDown(e, null, confirmPasswordRef)}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            type="password"
                                            placeholder="Password"
                                            className="w-full pl-12 pr-4 py-3 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-800 border-2 border-gray-100 rounded-2xl text-gray-700 focus:outline-none focus:border-purple-300 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex mb-2">
                                        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">Konfirmasi Password</label>
                                        <button className="ml-1 cursor-pointer" type="button">
                                            <svg onClick={showPasswordWarning} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="oklch(62.7% 0.265 303.9)" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            ref={confirmPasswordRef}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === "ArrowUp") {
                                                    e.preventDefault()
                                                    newPasswordRef.current?.focus()
                                                } else if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    handleUpdatePassword()
                                                }
                                            }}
                                            type="password"
                                            placeholder="Confirm password"
                                            className="w-full pl-12 pr-4 py-3 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-800 border-2 border-gray-100 rounded-2xl text-gray-700 focus:outline-none focus:border-purple-300 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button onClick={handleUpdatePassword} disabled={isPasswordLoading} className="hover:text-purple-600 w-full py-3 px-4 border-2 font-bold rounded-xl border-purple-200 text-purple-500 bg-purple-50 hover:bg-purple-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-800 dark:hover:border-gray-700 transition-all cursor-pointer flex justify-center items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                    {isPasswordLoading ? "Memproses..." : "Update Password"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoggingOut && (
                <div className="fixed inset-0 z-50 flex items-center backdrop-blur-xs justify-center bg-black/20 transition-opacity">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-fuchsia-200 border-t-fuchsia-400 rounded-full animate-spin"></div>
                        <span className="text-sm dark:text-gray-300 font-medium animate-pulse">
                            Keluar...
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}