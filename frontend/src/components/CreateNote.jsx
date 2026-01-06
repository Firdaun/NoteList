import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { createCategory, createNote, deleteCategory, getCategories, getNoteById, updateCategory, updateNote } from "../lib/note-api"
import { alertConfirm, alertError, alertSuccess } from "../lib/alert"

export default function CreateNote() {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [editingCategoryId, setEditingCategoryId] = useState(null)
    const [editCategoryName, setEditCategoryName] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { id } = useParams()
    const menuRef = useRef(null)
    const categoryInputRef = useRef(null)
    const isEditMode = Boolean(id)
    const navigate = useNavigate()

    useEffect(() => {
        getCategories()
            .then(result => setCategories(result.data))
            .catch(err => console.error('Gagal load category', err))
    }, [])

    const handleSelectCategory = (category) => {
        if (editingCategoryId) return
        setSelectedCategory(category)
        setNewCategoryName('')
        setIsCreating(false)
        setIsOpen(false)
    }

    const handleCreateNew = () => {
        setSelectedCategory(null)
        setNewCategoryName('')
        setIsCreating(true)
        setIsOpen(false)
    }

    const startEditing = (e, category) => {
        e.stopPropagation()
        setEditingCategoryId(category.id)
        setEditCategoryName(category.name)
    }

    const cancelEditing = (e) => {
        e.stopPropagation()
        setEditingCategoryId(null)
        setEditCategoryName('')
    }

    const saveEditing = async (e, categoryId) => {
        e.stopPropagation()
        if (!editCategoryName.trim()) return alertError("Nama kategori tidak boleh kosong")
        setIsSaving(true)
        try {
            await updateCategory(categoryId, editCategoryName)
            setCategories(prev => prev.map(cat =>
                cat.id === categoryId ? { ...cat, name: editCategoryName } : cat
            ))
            if (selectedCategory?.id === categoryId) {
                setSelectedCategory(prev => ({ ...prev, name: editCategoryName }))
            }
            setIsSaving(false)
            setEditingCategoryId(null)
            alertSuccess("Kategori berhasil diubah!")
        } catch (error) {
            alertError(error.message)
        }
    }


    const handleDeleteCategory = async (e, categoryId) => {
        e.stopPropagation()
        const isConfirmed = await alertConfirm("Hapus kategori ini? Semua catatan di dalamnya juga akan terhapus!")
        if (!isConfirmed) return
        setIsDeleting(true)
        try {
            await deleteCategory(categoryId)
            setCategories(prev => prev.filter(cat => cat.id !== categoryId))
            if (selectedCategory?.id === categoryId) {
                setSelectedCategory(null)
            }
            setIsDeleting(false)
            alertSuccess("Kategori dihapus.")
        } catch (error) {
            setIsDeleting(false)
            alertError(error.message)
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setEditingCategoryId(null)
            setEditCategoryName('')
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !content) {
            return alertError('Judul dan isi catatan wajib diisi')
        }
        if (!selectedCategory && !newCategoryName) {
            return alertError('Pilih kategori atau buat yang baru')
        }
        setIsLoading(true)
        try {
            let finalCategoryId = selectedCategory?.id
            if (isCreating && newCategoryName) {
                const newCat = await createCategory(newCategoryName)
                finalCategoryId = newCat.id
            }
            const payload = {
                title,
                content,
                categoryId: finalCategoryId
            }
            if (isEditMode) {
                await updateNote(id, payload)
                await alertSuccess("Catatan berhasil diperbarui!")
                navigate(-1)
            } else {
                await createNote(payload)
                await alertSuccess("Catatan berhasil dibuat!")
                navigate('/')
            }
        } catch (error) {
            alertError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isCreating && categoryInputRef.current) {
            categoryInputRef.current.focus()
        }
    }, [isCreating])
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        const initData = async () => {
            try {
                const catResult = await getCategories()
                setCategories(catResult.data)
                if (isEditMode) {
                    const noteData = await getNoteById(id)
                    setTitle(noteData.title)
                    setContent(noteData.content)
                    if (noteData.category) {
                        setSelectedCategory(noteData.category)
                    }
                }
            } catch (error) {
                console.error("Gagal memuat data", error)
                if (isEditMode) {
                    alertError("Gagal memuat catatan untuk diedit.")
                    navigate('/')
                }
            } finally {
                setIsFetching(false)
            }
        }
        initData()
    }, [id, isEditMode, navigate])
    if (isEditMode && isFetching) {
        return (
            <div className="max-w-7xl h-dvh w-11/12 mx-auto flex flex-col pt-16 animate-pulse">
                <div className="flex items-center gap-4 my-8">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            <div className="h-11 w-full bg-gray-100 rounded-lg border border-gray-100"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-11 w-full bg-gray-100 rounded-lg border border-gray-100"></div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="flex-1 w-full bg-gray-100 rounded-lg border border-gray-100"></div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 pb-8">
                        <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl h-dvh w-11/12 mx-auto flex flex-col pt-16">

            <div className="flex items-center gap-4 my-8">
                <button onClick={() => navigate(-1)} className="cursor-pointer text-gray-400 hover:text-fuchsia-500 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Edit Catatan' : 'Buat Catatan'}</h1>
                    <p className="text-gray-500 text-sm">{isEditMode ? "Perbaiki tulisanmu." : "Simpan ide dan rencanamu di sini."}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Judul
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            id="title"
                            placeholder="Judul"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 outline-none transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <div ref={menuRef} className="w-full relative">

                            <div className="border bg-white focus-within:ring-2 focus-within:ring-fuchsia-400 focus-within:border-fuchsia-400 transition border-gray-300 rounded-lg overflow-hidden flex">
                                {isCreating ? (
                                    <input
                                        ref={categoryInputRef}
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Masukkan kategori"
                                        className="w-full px-4 py-2 outline-none text-gray-700"
                                    />
                                ) : (
                                    <h1
                                        onClick={() => setIsOpen(!isOpen)}
                                        className={`w-full px-4 py-2 cursor-pointer select-none ${!selectedCategory ? "text-gray-500" : "text-gray-800"}`}
                                    >
                                        {selectedCategory ? selectedCategory.name : "Pilih Kategori"}
                                    </h1>
                                )}

                                <div
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-10 items-center flex justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer">
                                    <svg
                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className={`absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ease-out origin-top
                                ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                <ul className="py-1">
                                    {categories.map((cat) => (
                                        <li key={cat.id} className="flex group justify-between hover:bg-gray-100 items-center">
                                            {editingCategoryId === cat.id ? (

                                                <div className="flex-1 flex items-center px-2 py-1 gap-2 bg-fuchsia-50">
                                                    <input
                                                        type="text"
                                                        value={editCategoryName}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                                        className="flex-1 px-2 py-1 text-sm border border-fuchsia-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                                                        autoFocus
                                                    />
                                                    <div onClick={(e) => saveEditing(e, cat.id)} className="p-1 hover:bg-green-100 rounded text-green-500 cursor-pointer" title="Simpan">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentcolor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                                    </div>
                                                    <div onClick={cancelEditing} className="p-1 hover:bg-red-100 rounded text-red-500 cursor-pointer" title="Batal">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div onClick={() => handleSelectCategory(cat)} className="block flex-1 px-4 py-2 text-sm text-gray-500 group-hover:text-fuchsia-400 cursor-pointer truncate font-medium">
                                                        {cat.name}
                                                    </div>

                                                    <div className="flex items-center gap-1 mr-2 opacity-100 lg:opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100 transition-opacity">
                                                        <div onClick={(e) => startEditing(e, cat)} className="p-1.5 text-gray-400 hover:text-fuchsia-500 hover:bg-fuchsia-50 rounded-lg cursor-pointer transition-colors" title="Ganti Nama">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48V152a16,16,0,0,1-16,16H99.31l10.35,10.34a8,8,0,0,1-11.32,11.32l-24-24a8,8,0,0,1,0-11.32l24-24a8,8,0,0,1,11.32,11.32L99.31,152H208V48H96v8a8,8,0,0,1-16,0V48A16,16,0,0,1,96,32H208A16,16,0,0,1,224,48ZM168,192a8,8,0,0,0-8,8v8H48V104H156.69l-10.35,10.34a8,8,0,0,0,11.32,11.32l24-24a8,8,0,0,0,0-11.32l-24-24a8,8,0,0,0-11.32,11.32L156.69,88H48a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16v-8A8,8,0,0,0,168,192Z"></path></svg>
                                                        </div>
                                                        <div onClick={(e) => handleDeleteCategory(e, cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors" title="Hapus Kategori">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}

                                    <li onClick={handleCreateNew} className="px-4 py-2 text-sm flex gap-2 items-center hover:bg-gray-100 text-fuchsia-500 cursor-pointer font-medium border-t border-gray-50 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
                                        <span>Buat kategori</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-5 flex-1 flex flex-col gap-4">
                    <div className="flex-1 flex flex-col space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Catatan
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            id="content"
                            name="content"
                            placeholder="Tulis detail catatanmu di sini..."
                            className="flex-1 h-full w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 outline-none transition resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100">
                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-white transition shadow-md
                            ${isLoading ? 'bg-fuchsia-300 cursor-not-allowed' : 'bg-fuchsia-400 hover:bg-fuchsia-500 focus:ring-4 cursor-pointer'}`}>
                            {isLoading ? (
                                <>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                "Simpan Catatan"
                            )}
                        </button>
                    </div>
                </div>
            </form>
            {(isDeleting || isSaving || isLoading) && (
                <div className="fixed inset-0 z-50 backdrop-blur-xs flex items-center justify-center bg-black/20 transition-opacity">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-fuchsia-200 border-t-fuchsia-400 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium animate-pulse">
                            {isDeleting ? "Menghapus..." : "Menyimpan..."}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}