import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response.error.js"
import { noteValidation } from "../validation/note.validation.js"
import { validate } from "../validation/validation.js"

const create = async (user, request) => {
    const note = validate(noteValidation.createNoteValidation, request)
    note.username = user.username

    const categoryCount = await prismaClient.category.count({
        where: {
            username: user.username,
            id: note.categoryId
        }
    })

    if (categoryCount !== 1) {
        throw new ResponseError(404, 'Category not found')
    }

    return prismaClient.notes.create({
        data: note,
        select: {
            id: true,
            title: true,
            content: true,
            categoryId: true,
            createdAt: true
        }
    })
}

const get = async (user, request) => {
    const data = validate(noteValidation.getNoteValidation, request)

    const skip = (data.page - 1) * data.size

    const filters = []
    filters.push({
        username: user.username
    })

    if (data.search) {
        filters.push({
            OR: [
                { title: { contains: data.search } },
                { content: { contains: data.search } },
            ]
        })
    }

    const notes = await prismaClient.notes.findMany({
        where: {
            AND: filters
        },
        take: data.size,
        skip: skip,
        include: {
            category: true
        }
    })

    const totalItems = await prismaClient.notes.count({
        where: {
            AND: filters
        }
    })

    return {
        data: notes,
        paging: {
            page: data.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / data.size)
        }
    }
}

const getById = async (user, noteId) => {
    noteId = validate(noteValidation.getNoteIdValidation, noteId)

    const note = await prismaClient.notes.findFirst({
        where: {
            username: user.username,
            id: noteId
        },
        include: {
            category: true
        }
    })

    if (!note) {
        throw new ResponseError(404, 'Note not found')
    }

    return note
}

const update = async (user, request) => {
    const note = validate(noteValidation.updateNoteValidation, request)

    const totalInDatabase = await prismaClient.notes.count({
        where: {
            username: user.username,
            id: note.id
        }
    })

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, 'Note not found')
    }

    if (note.categoryId) {
        const categoryCount = await prismaClient.category.count({
            where: {
                username: user.username,
                id: note.categoryId
            }
        })

        if (categoryCount !== 1) {
            throw new ResponseError(404, 'Category not found')
        }
    }

    return prismaClient.notes.update({
        where: {
            id: note.id
        },
        data: {
            title: note.title,
            content: note.content,
            categoryId: note.categoryId
        },
        select: {
            id: true,
            title: true,
            content: true,
            categoryId: true,
            updatedAt: true
        }
    })
}

const remove = async (user, noteId) => {
    noteId = validate(noteValidation.getNoteIdValidation, noteId)

    const totalInDatabase = await prismaClient.notes.count({
        where: {
            username: user.username,
            id: noteId
        }
    })

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, 'Note not found')
    }

    return prismaClient.notes.delete({
        where: {
            id: noteId
        }
    })
}

export const noteService = {
    create,
    get,
    getById,
    update,
    remove
}