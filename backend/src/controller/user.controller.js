import { userService } from "../service/user.service.js"

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body)
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            data: {
                username: result.username,
                name: result.name
            }
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const username = req.user.username
        const result = await userService.get(username)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user.username
        const request = req.body
        request.username = username
        const result = await userService.update(request)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.user.username)
        res.clearCookie('token')
        res.status(200).json({
            data: 'OK'
        })
    } catch (e) {
        next(e)
    }
}

export const userController = {
    register,
    login,
    get,
    update,
    logout
}