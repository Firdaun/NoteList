import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

export const removeTestUser = async () => {
    await prismaClient.users.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.users.create({
        data: {
            username: "test",
            name: "test",
            password: await bcrypt.hash("rahasia", 10),
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.users.findUnique({
        where: {
            username: "test"
        }
    })
}

// ---------------- category ---------------- //
export const removeTestCategory = async () => {
    return prismaClient.category.deleteMany({
        where: {
            username: "test"
        }
    });
}

export const createTestCategory = async () => {
    return prismaClient.category.create({
        data: {
            name: "Elektronik",
            username: "test"
        }
    });
}

export const createManyTestCategories = async () => {
    // Buat 5 kategori sekaligus untuk ngetes limit
    await prismaClient.category.createMany({
        data: [
            { name: "Kategori 1", username: "test" },
            { name: "Kategori 2", username: "test" },
            { name: "Kategori 3", username: "test" },
            { name: "Kategori 4", username: "test" },
            { name: "Kategori 5", username: "test" },
        ]
    });
}

export const removeTestNote = async () => {
    return prismaClient.notes.deleteMany({
        where: {
            username: "test"
        }
    });
}

export const createTestNote = async () => {
    // Kita butuh ID Category dulu karena Note wajib punya categoryId
    const category = await prismaClient.category.findFirst({
        where: {
            username: "test"
        }
    });

    if (!category) {
        throw new Error("Test Category must be created first!");
    }

    return prismaClient.notes.create({
        data: {
            title: "Test Note",
            content: "Test Content",
            username: "test",
            categoryId: category.id
        }
    });
}