const Joi = require("joi");

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string()
        .required()
        .min(3)
        .max(20),
        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
    });

    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation
}
