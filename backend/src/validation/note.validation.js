import Joi from "joi"

const createNoteValidation = Joi.object({
    title: Joi.string().max(30).required(),
    content: Joi.string().required(),
    categoryId: Joi.number().positive().required()
})

const getNoteValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    search: Joi.string().optional(),
    category: Joi.string().optional()
})

const getNoteIdValidation = Joi.number().positive().required()

const updateNoteValidation = Joi.object({
    id: Joi.number().positive().required(),
    title: Joi.string().max(30).required(),
    content: Joi.string().optional(),
    categoryId: Joi.number().positive().optional()
})
export const noteValidation = {
    createNoteValidation,
    getNoteValidation,
    getNoteIdValidation,
    updateNoteValidation
}