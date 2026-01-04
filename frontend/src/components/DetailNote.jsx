import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { deleteNote, getNoteById } from "../lib/note-api"
import { alertConfirm, alertError, alertSuccess } from "../lib/alert"

export default function DetailNote() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        getNoteById(id)
            .then(data => setNote(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id, navigate])

    const handleDelete = async () => {
        const isConfirmed = await alertConfirm("Yakin ingin menghapus catatan ini?")
        if (!isConfirmed) return
        setIsDeleting(true)
        try {
            await deleteNote(id)
            setIsDeleting(false)
            await alertSuccess("Catatan berhasil dihapus!")
            navigate("/")
        } catch (error) {
            setIsDeleting(false)
            alertError(error.message)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'}
        return new Date(dateString).toLocaleDateString('id-ID', options)
    }

    if (loading) {
        return (
            <div className="pt-27 min-h-[calc(100vh-64px)] bg-white py-10">
                <div className="max-w-3xl w-[90%] mx-auto animate-pulse">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                    <div className="border-2 border-gray-100 rounded-2xl p-8 shadow-sm h- relative overflow-hidden bg-gray-50">
                        <div className="border-b-2 border-dashed border-gray-200 pb-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-8 w-27 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-27 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-10 w-3/4 bg-gray-200 rounded mb-2"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <div className="h-12 w-32 bg-gray-200 rounded-xl"></div>
                        <div className="h-12 w-32 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!note) return null

    return (
        <div className="pt-16 bg-white py-10">
            <div className="max-w-3xl w-[90%] mx-auto">

                <div className="flex items-center gap-4 my-8">
                    <button onClick={() => navigate(-1)} className="cursor-pointer text-gray-400 hover:text-fuchsia-500 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Profil Kamu</h1>
                        <p className="text-gray-500 text-sm">Atur informasi pribadi dan keamanan akunmu.</p>
                    </div>
                </div>

                <div className="bg-fuchsia-50/50 border-2 border-fuchsia-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-200 rounded-full blur-2xl opacity-50"></div>
                    <div className="absolute top-20 -left-10 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-50"></div>

                    <div className="relative">
                        <div className="border-b-2 border-dashed border-fuchsia-200 pb-6 mb-6">
                            <div className="flex justify-between">
                                <span className="bg-white text-fuchsia-500 px-3 py-1 rounded-full text-sm font-semibold border border-fuchsia-100 shadow-sm">
                                    {note.category ? note.category.name : "Uncategorized"}
                                </span>
                                <span className="bg-white text-fuchsia-500 px-3 py-1 rounded-full text-sm font-semibold border border-fuchsia-100 shadow-sm">
                                    {formatDate(note.createdAt)}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-4 ">
                                {note.title}
                            </h1>
                        </div>
                        <div className="prose prose-lg prose-fuchsia max-w-none text-gray-600 leading-loose">
                            <p className="whitespace-pre-wrap">{note.content}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={() => navigate(`/edit/${id}`)} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-xl hover:border-fuchsia-200 hover:text-fuchsia-500 hover:bg-fuchsia-50 transition font-semibold cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit Note
                    </button>

                    <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition font-semibold cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete
                    </button>
                </div>

            </div>
            {isDeleting && (
                <div className="fixed inset-0 z-50 backdrop-blur-xs flex items-center justify-center bg-black/20 transition-opacity">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-fuchsia-200 border-t-fuchsia-400 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium animate-pulse">
                            Menghapus...
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}