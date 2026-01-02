import express from "express"
import { userController } from "../controller/user.controller.js"

const publicRouter = new express.Router()

publicRouter.post('/api/users/register', userController.register)
publicRouter.post('/api/users/login', userController.login)

publicRouter.get('/api/ping', async (req, res) => {
    try {
        await prismaClient.$queryRaw`SELECT 1`;
        
        res.status(200).json({ 
            status: "OK", 
            message: "Server Nyala & Database Terhubung! 🚀" 
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ 
            status: "ERROR", 
            message: "Server Nyala, TAPI Database Gagal 😭", 
            error: error.message 
        });
    }
});

export {
    publicRouter
}