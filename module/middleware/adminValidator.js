const joi = require("joi")

const adminValidator = joi.object({
    username : joi.string().required(),
    email : joi.string().email().required(),
    password : joi.string().min(6).max(255).required()
})

module.exports = adminValidator