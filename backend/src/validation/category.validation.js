import Joi from "joi";

const createCategoryValidation = Joi.object({
    name: Joi.string().max(100).required()
});

const updateCategoryValidation = Joi.object({
    id: Joi.number().positive().required(),
    name: Joi.string().max(100).required()
});

const getCategoryValidation = Joi.number().positive().required();

export {
    createCategoryValidation,
    updateCategoryValidation,
    getCategoryValidation
}