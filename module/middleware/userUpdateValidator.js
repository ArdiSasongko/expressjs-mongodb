const joi = require("joi")

const userUpdateValidator = joi.object({
    username : joi.string().optional(),
    password : joi.string().min(6).max(255).optional(),
    location : joi.string().optional()
})

module.exports = userUpdateValidator