// src/service/user-api.js (atau sesuaikan dengan lokasi file kamu)

const BASE_URL = import.meta.env.VITE_API_URL // Sesuaikan port backend

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
};

export const loginUser = async (data) => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors || "Login gagal");
    }

    return result;
};

export const getUser = async (token) => {
    const response = await fetch(`${BASE_URL}/api/users/current`, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'Accept': 'application/json'
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal mengambil data user')
    }
    return result
}

export const updateUser = async (token, data) => {
    const response = await fetch(`${BASE_URL}/api/users/current`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(data)
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal update profile')
    }
    return result
}

export const logoutAPI = async (token) => {
    const response = await fetch(`${BASE_URL}/api/users/logout`, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.errors || 'Gagal logout')
    }
    return result
}



export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}