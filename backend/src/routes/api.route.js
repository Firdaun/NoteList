import express from "express"
import { userController } from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { categoryController } from "../controller/category.controller"
import { noteController } from "../controller/note.controller"

const userApiRouter = new express.Router()

userApiRouter.use(authMiddleware)
// User API
userApiRouter.get('/api/users/current', userController.get)
userApiRouter.patch('/api/users/current', userController.update)
userApiRouter.delete('/api/users/logout', userController.logout)
// CategoryAPI
userApiRouter.post('/api/categories', categoryController.create)
userApiRouter.get('/api/categories', categoryController.get)
userApiRouter.put('/api/categories/:categoryId', categoryController.update)
// Note API
userApiRouter.post('/api/notes', noteController.create)
userApiRouter.get('/api/notes', noteController.get)
userApiRouter.get('/api/notes/:noteId', noteController.getById)
userApiRouter.put('/api/notes/:noteId', noteController.update)
userApiRouter.delete('/api/notes/:noteId', noteController.remove)

export {
    userApiRouter
}