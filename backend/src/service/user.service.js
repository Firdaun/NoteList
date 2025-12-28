import { prismaClient } from "../application/database"
import { ResponseError } from "../error/response.error"
import { userValidation } from "../validation/user.validation"
import { validate } from "../validation/validation"
import { v4 as uuid } from "uuid"
import bcrypt from "bcrypt"

const register = async (request) => {
    const user = validate(userValidation.registerUserValidation, request)

    const countUser = await prismaClient.users.count({
        where: {
            username: user.username
        }
    })

    if (countUser === 1) {
        throw new ResponseError(400, "username already exists")
    }

    user.password = await bcrypt.hash(user.password, 10)

    return prismaClient.users.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    })
}


const login = async (request) => {
    const loginRequest = validate(userValidation.loginUserValidation, request)

    const user = await prismaClient.users.findUnique({
        where: {
            username: loginRequest.username
        }
    })

    if (!user) {
        throw new ResponseError(401, "invalid username or password")
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)

    if (!isPasswordValid) {
        throw new ResponseError(401, "invalid username or password")
    }

    const token = uuid().toString()

    return prismaClient.users.update({
        where: {
            username: user.username
        },
        data: {
            token: token
        },
        select: {
            token: true,
            username: true,
            name: true
        }
    })
}

const get = async (username) => {
    username = validate(userValidation.getUserValidation, username)

    const user = await prismaClient.users.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    })

    if (!user) {
        throw new ResponseError(404, 'user nou found')
    }

    return user
}

const update = async (request) => {
    const user = validate(userValidation.updateUserValidation, request)

    const userInDatabase = await prismaClient.users.findUnique({
        where: {
            username: user.username
        }
    })

    if (!userInDatabase) {
        throw new ResponseError(404, 'user not found')
    }

    const data = {}

    if (user.name) {
        data.name = user.name
    }

    if (user.password) {
        const isSamePassword = await bcrypt.compare(user.password, userInDatabase.password)

        if (isSamePassword) {
            throw new ResponseError(400, "Password kamu sama dengan yang sebelumnya")
        }

        data.password = await bcrypt.hash(user.password, 10)
    }

    return prismaClient.users.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    })
}

const logout = async (username) => {
    username = validate(userValidation.getUserValidation, username)

    const user = await prismaClient.users.findUnique({
        where: {
            username: username
        }
    })

    if (!user) {
        throw new ResponseError(404, 'user not found')
    }

    return prismaClient.users.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export const userService = {
    register,
    login,
    get,
    update,
    logout
}