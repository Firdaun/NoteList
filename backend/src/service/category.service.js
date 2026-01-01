import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response.error.js"
import { categoryValidation } from "../validation/category.validation.js"
import { validate } from "../validation/validation.js"

const create = async (user, request) => {
    const category = validate(categoryValidation.createCategoryValidation, request)
    category.username = user.username

    const totalCategory = await prismaClient.category.count({
        where: {
            username: user.username
        }
    })

    if (totalCategory >= 5) {
        throw new ResponseError(400, "Category limit reached!")
    }

    return prismaClient.category.create({
        data: category,
        select: {
            id: true,
            name: true
        }
    })
}

const get = async (user) => {
    return prismaClient.category.findMany({
        where: {
            username: user.username
        },
        select: {
            id: true,
            name: true
        }
    })
}

const update = async (user, request) => {
    const category = validate(categoryValidation.updateCategoryValidation, request)
    const totalInDatabase = await prismaClient.category.count({
        where: {
            username: user.username,
            id: category.id
        }
    })

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "Category not found")
    }

    return prismaClient.category.update({
        where: {
            id: category.id
        },
        data: {
            name: category.name
        },
        select: {
            id: true,
            name: true
        }
    })
}

const remove = async (user, categoryId) => {
    categoryId = validate(categoryValidation.getCategoryValidation, categoryId)

    const totalInDatabase = await prismaClient.category.count({
        where: {
            username: user.username,
            id: categoryId
        }
    })

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "Category not found")
    }

    await prismaClient.notes.deleteMany({
        where: {
            username: user.username,
            categoryId: categoryId
        }
    })

    return prismaClient.category.delete({
        where: {
            id: categoryId
        }
    })
}

export const categoryService = {
    create,
    get,
    update,
    remove
}