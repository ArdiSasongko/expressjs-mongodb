const asyncHandler = require("express-async-handler")
const Response = require("../model/response")
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler (async (req,res,next) => {
    let Token
    let authHeader = req.headers.authorization

    if(Token && authHeader.startsWith("Bearer")){
        Token = authHeader.split(" ")[1]

        if(!Token){
            const response = new Response.Error(true, 404, "Need Token")
            return res.status(404).json(response)
        }

        jwt.verify(Token, process.env.KEY, (err,decode) => {
            if(err){
                const response = new Response.Error(true, 400, err.message)
                return res.status(400).json(response)
            }

            req.user = decode.user
            next()
        })
    }else {
        const response = new Response.Error(true, 401, "Invalid Token")
        return res.status(401).json(response)
    }
})

module.exports = validateToken