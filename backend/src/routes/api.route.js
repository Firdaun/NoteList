import express from "express";
import userController from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import categoryController from "../controller/category.controller.js";

const userApiRouter = new express.Router();

userApiRouter.use(authMiddleware);

userApiRouter.get('/api/users/current', userController.get);
userApiRouter.patch('/api/users/current', userController.update);
userApiRouter.delete('/api/users/logout', userController.logout);

userApiRouter.post('/api/categories', categoryController.create);
userApiRouter.get('/api/categories', categoryController.get);
userApiRouter.put('/api/categories/:categoryId', categoryController.update);

export {
    userApiRouter
}