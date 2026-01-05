import { noteService } from "../service/note.service.js"

const create = async (req, res, next) => {
    try {
        const result = await noteService.create(req.user, req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const request = {
            page: req.query.page,
            size: req.query.size,
            search: req.query.search,
            category: req.query.category,
            sort: req.query.sort
        }
        const result = await noteService.get(req.user, request)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const getById = async (req, res, next) => {
    try {
        const noteId = req.params.noteId
        const result = await noteService.getById(req.user, noteId)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const noteId = req.params.noteId
        const request = req.body
        request.id = noteId
        const result = await noteService.update(req.user, request)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const noteId = req.params.noteId
        await noteService.remove(req.user, noteId)
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e)
    }
}

export const noteController = {
    create,
    get,
    getById,
    update,
    remove
}