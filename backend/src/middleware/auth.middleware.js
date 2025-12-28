import { prismaClient } from '../application/database'

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({
            errors: 'Unauthorized'
        }).end()
    } else {
        const user = await prismaClient.users.findFirst({
            where: {
                token: token
            }
        })
        if (!user) {
            res.clearCookie('token')
            res.status(401).json({
                errors: 'Unauthorized'
            }).end()
        } else {
            req.user = user
            next()
        }
    }
}