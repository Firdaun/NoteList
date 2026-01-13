const BASE_URL = import.meta.env.PROD ? "" : import.meta.env.VITE_API_URL

export const registerUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors || "Registrasi gagal");
    }

    return result;
}

export const loginUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.errors || result.message || "Login gagal");
        error.status = response.status;
        
        if (result.retryAfter) {
            error.retryAfter = result.retryAfter; 
        }
        throw error;
    }

    return result;
}

export const getUser = async () => {
    const response = await fetch(`${BASE_URL}/api/users/current`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal mengambil data user')
    }
    return result
}

export const updateUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/users/current`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal update profile')
    }
    return result
}

export const logoutAPI = async () => {
    const response = await fetch(`${BASE_URL}/api/users/logout`, {
        method: 'DELETE',
        credentials: 'include',
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal logout')
    }
    return result
}



export const logout = () => localStorage.removeItem('user')
