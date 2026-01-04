const BASE_URL = import.meta.env.PROD ? "" : import.meta.env.VITE_API_URL

export const getCategories = async () => {
    const response = await fetch(`${BASE_URL}/api/categories`, {
        credentials: 'include',
        headers: {
            'accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error('Gagal buat categori')
    }
    return result
}

export const createCategory = async (name) => {
    const response = await fetch(`${BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name })
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal mengambil category')
    }
    return result.data
}

export const updateCategory = async (id, name) => {
    const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name })
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal update category')
    }
    return result.data
}

export const deleteCategory = async (id) => {
    const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal hapus kategori')
    }
    return result.data
}

export const createNote = async (data) => {
    const response = await fetch(`${BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal simpan note')
    }
    return result.data
}

export const getNotes = async (params = {}) => {
    const cleanParams = {}

    Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== "") {
            cleanParams[key] = params[key]
        }
    })

    const query = new URLSearchParams(cleanParams).toString()
    
    const response = await fetch(`${BASE_URL}/api/notes?${query}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal mengambil data notes')
    }
    return result
}

export const getNoteById = async (id) => {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal mengambil detail note')
    }
    return result.data
}

export const updateNote = async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal mengupdate note')
    }
    return result.data
}

export const deleteNote = async (id) => {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal menghapus note')
    }
    return result.data
}