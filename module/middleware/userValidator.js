const joi = require("joi")

const userValidator = joi.object({
    username : joi.string().required(),
    email : joi.string().required(),
    password : joi.string().min(6).max(255).required(),
    location : joi.string().required()
})

module.exports = userValidator