import { categoryService } from "../service/category.service"

const create = async (req, res, next) => {
    try {
        const result = await categoryService.create(req.user, req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await categoryService.get(req.user)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId
        const request = req.body
        request.id = categoryId
        const result = await categoryService.update(req.user, request)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const categoryController = {
    create,
    get,
    update
}
