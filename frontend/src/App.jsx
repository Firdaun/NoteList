import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getCategories, getNotes } from "./lib/note-api";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"

export default function App() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)
    const [categories, setCategories] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(searchParams.get("page") || "1")
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const categoryParam = searchParams.get("category")
    const selectedCategory = categories.find(cat => cat.id == categoryParam) || null
    const [isSortOpen, setIsSortOpen] = useState(false)
    const sortMenuRef = useRef(null)
    const sortBy = searchParams.get("sort") || "latest"
    const queryClient = useQueryClient()

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error("Gagal load kategori", err))
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            if (search !== debouncedSearch) {
                setSearchParams(prev => {
                    prev.set("page", 1)
                    return prev
                })
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const {
        data: notesData,
        isLoading,
        isPlaceholderData
    } = useQuery({
        queryKey: ['notes', page, debouncedSearch, selectedCategory?.name, sortBy],
        queryFn: () => getNotes({
            page: page,
            size: 12,
            search: debouncedSearch,
            category: selectedCategory ? selectedCategory.name : '',
            sort: sortBy
        }),
        placeholderData: keepPreviousData,
        staleTime: 5000
    })

    useEffect(() => {
        if (notesData?.paging?.total_page > page) {
            const nextPage = page + 1
            queryClient.prefetchQuery({
                queryKey: ['notes', nextPage, debouncedSearch, selectedCategory?.name, sortBy],
                queryFn: () => getNotes({
                    page: nextPage,
                    size: 12,
                    search: debouncedSearch,
                    category: selectedCategory ? selectedCategory.name : '',
                    sort: sortBy
                }),
                staleTime: 5000
            })
        }
    }, [notesData, page, queryClient, debouncedSearch, selectedCategory, sortBy])

    const notes = notesData?.data || []
    const totalPages = notesData?.paging?.total_page || 0

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams(prev => {
                prev.set("page", newPage)
                return prev
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const getPaginationGroup = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        if (page <= 3) {
            return [1, 2, 3, 'jump-next', totalPages]
        }
        if (page >= totalPages - 2) {
            return [1, 'jump-prev', totalPages - 2, totalPages - 1, totalPages]
        }
        return [1, 'jump-prev', page, 'jump-next', totalPages]
    }

    const formatDate = (dateString) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInSeconds = Math.floor((now - date) / 1000)

        const minute = 60
        const hour = 60 * minute
        const day = 24 * hour
        const month = 30 * day

        if (diffInSeconds < minute) {
            return 'Baru saja'
        }
        if (diffInSeconds < hour) {
            return `${Math.floor(diffInSeconds / minute)} menit yang lalu`
        }
        if (diffInSeconds < day) {
            return `${Math.floor(diffInSeconds / hour)} jam yang lalu`
        }
        if (diffInSeconds < month) {
            return `${Math.floor(diffInSeconds / day)} hari yang lalu`
        }

        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        return new Date(dateString).toLocaleDateString('id-ID', options)
    }

    const getSortLabel = () => {
        switch (sortBy) {
            case 'oldest': return 'Terlama'
            case 'a-z': return 'A-Z'
            case 'z-a': return 'Z-A'
            default: return 'Terbaru'
        }
    }

    const sortOptions = [
        { value: 'latest', label: 'Terbaru' },
        { value: 'oldest', label: 'Terlama' },
        { value: 'a-z', label: 'A-Z' },
        { value: 'z-a', label: 'Z-A' },
    ]

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false)
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
                setIsSortOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    return (
        <div className="pt-16 min-h-screen bg-gray-50 pb-27">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fuchsia-200 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
            </div>

            <section className="max-w-7xl w-[90%] mx-auto pt-10">
                <div className="flex flex-col justify-between md:items-start mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Catatan Kamu <span className="text-2xl">✨</span>
                        </h1>
                        {isPlaceholderData && <p className="text-xs text-fuchsia-400 mt-1 animate-pulse">Memuat data baru...</p>}
                    </div>
                    <div className="flex flex-col-reverse md:flex-row w-full justify-between gap-5 md:gap-10">
                        <div className="flex md:w-full lg:w-110 xl:w-150 min-w-70 justify-between">
                            <Link to='/createnote' className="rounded-xl group w-full flex gap-5 rounded-3xl border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/50 hover:bg-fuchsia-50 hover:border-fuchsia-400 transition cursor-pointer">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-fuchsia-400 group-hover:text-fuchsia-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                                <span className="mt-3 font-semibold text-fuchsia-400 group-hover:text-fuchsia-600">Buat Baru</span>
                            </Link>

                            <div ref={sortMenuRef} onClick={() => setIsSortOpen(!isSortOpen)} className="relative cursor-pointer select-none">
                                <div className="p-3 hover:cursor-pointer w-26 xl:w-35 text-gray-500 h-full rounded-xl flex items-center justify-center bg-white border-gray-100 border-2 shadow-sm">
                                    <h1>{getSortLabel()}</h1>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div className={`absolute top-full right-2 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ease-out origin-top-right
                                ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                    <ul className="py-1 max-h-60 overflow-y-auto">
                                        {sortOptions.map((option) => (
                                            <li key={option.value}>
                                                <div onClick={() => {
                                                    setSearchParams(prev => {
                                                        prev.set("sort", option.value)
                                                        prev.set("page", 1)
                                                        return prev
                                                    })
                                                }}
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-fuchsia-400">
                                                    {option.label}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end md:w-full lg:w-110 xl:w-150">
                            <div className="relative w-full group">
                                <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-fuchsia-300 transition-all shadow-sm"
                                    placeholder="Cari catatan..."
                                />
                                {search && (
                                    <div onClick={() => {
                                        setSearch("")
                                        setSearchParams(prev => {
                                            prev.delete("category")
                                            return prev
                                        })
                                    }} className="absolute right-3 top-3.25 text-gray-400 group-focus-within:text-fuchsia-500 hover:cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentcolor" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
                                    </div>
                                )}
                            </div>
                            <div ref={menuRef} onClick={() => setIsOpen(!isOpen)} className="text-gray-500 select-none cursor-pointer relative">
                                <div className="p-3 h-full xl:w-35 rounded-xl flex items-center justify-center bg-white border-gray-100 border-2 shadow-sm">
                                    <span>{selectedCategory ? selectedCategory.name : "Kategori"}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div className={`absolute top-full right-2 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ease-out origin-top-right
                                ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                    <ul className="py-1 max-h-60 overflow-y-auto">

                                        <li>
                                            <div
                                                onClick={() => {
                                                    setSearchParams(prev => {
                                                        prev.delete("category")
                                                        prev.set("page", 1)
                                                        return prev
                                                    })
                                                }}
                                                className={`block px-4 py-2 text-sm hover:bg-gray-100 hover:text-fuchsia-400 cursor-pointer border-b border-gray-50 font-semibold
                                                ${selectedCategory === null ? 'text-fuchsia-500' : 'text-gray-600'}`}>
                                                Semua Kategori
                                            </div>
                                        </li>

                                        {categories.map((cat) => (
                                            <li key={cat.id}>
                                                <div
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-fuchsia-400"
                                                    onClick={() => {
                                                        setSearchParams(prev => {
                                                            prev.set("category", cat.id)
                                                            prev.set("page", 1)
                                                            return prev
                                                        })
                                                    }}>
                                                    {cat.name}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && (
                        [...Array(11)].map((_, i) => (
                            <div key={i} className="h-60 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                </div>

                                <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>

                                <div className="space-y-2 mb-auto">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>

                                <div className="mt-14 h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        ))
                    )}

                    {!isLoading && notes.length === 0 && (
                        <div className="col-span-3 flex flex-col items-center justify-center h-60 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                            <p>Belum ada catatan nih...</p>
                        </div>
                    )}

                    {notes.map((note) => (
                        <Link
                            key={note.id}
                            to={`/${note.id}`}
                            className="relative justify-between flex flex-col h-60 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-fuchsia-400 to-pink-400 opacity-100 transition-opacity"></div>
                            <div>
                                <div className="flex justify-between items-start ">
                                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-fuchsia-100 text-fuchsia-600 transition-colors uppercase tracking-wider">
                                        {note.category ? note.category.name : 'Uncategorized'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {formatDate(note.updatedAt)}
                                    </span>
                                </div>

                                <h2 className="text-xl my-2 font-bold line-clamp-1 text-fuchsia-600 transition-colors">
                                    {note.title}
                                </h2>

                                <div className="overflow-hidden h-25.5">
                                    <p className="text-gray-500 text-sm break-all leading-relaxed">
                                        {note.content ? note.content.substring(0, 150) + (note.content.length > 150 ? "..." : "") : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center text-fuchsia-400 font-semibold text-sm">
                                Baca selengkapnya
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="fixed bottom-6 left-0 w-full flex justify-center z-50 pointer-events-none">
                        <nav className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-2 transition-all transform hover:-translate-y-1">

                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 flex items-center font-medium text-sm
                                    ${page === 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-fuchsia-50 hover:text-fuchsia-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                                Prev
                            </button>

                            {getPaginationGroup().map((item, index) => {
                                if (item === 'jump-prev') {
                                    return (
                                        <button
                                            key={'prev-' + index}
                                            onClick={() => handlePageChange(page - 3)}
                                            className="cursor-pointer w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-fuchsia-50 hover:text-fuchsia-500 rounded-xl transition-colors font-bold pb-2"
                                            title="Mundur 3 halaman">
                                            ...
                                        </button>
                                    )
                                }

                                if (item === 'jump-next') {
                                    return (
                                        <button
                                            key={'next-' + index}
                                            onClick={() => handlePageChange(page + 3)}
                                            className="cursor-pointer w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-fuchsia-50 hover:text-fuchsia-500 rounded-xl transition-colors font-bold pb-2"
                                            title="Lompat 3 halaman">
                                            ...
                                        </button>
                                    )
                                }

                                return (
                                    <button
                                        key={item}
                                        onClick={() => handlePageChange(item)}
                                        className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all
                                            ${page === item
                                                ? 'bg-linear-to-r from-fuchsia-400 to-pink-400 text-white shadow-md shadow-fuchsia-200 transform scale-105'
                                                : 'text-gray-500 hover:bg-fuchsia-50 hover:text-fuchsia-500'}`}>
                                        {item}
                                    </button>
                                )
                            })}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className={`cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 flex items-center font-medium text-sm
                                    ${page === totalPages
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-fuchsia-50 hover:text-fuchsia-500'}`}>
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                )}

            </section>
        </div>
    )
}