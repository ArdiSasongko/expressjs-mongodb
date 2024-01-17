const asyncHandler = require("express-async-handler")
const User = require("../model/userModel")
const Response = require("../model/response")
const userValidator = require("../middleware/userValidator")
const loginValidator = require("../middleware/loginValidator")
const jwtToken = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const registerUser = asyncHandler (async (req,res) => {
    try {
        const request = await userValidator.validateAsync(req.body)

        const username = await User.findOne({ username : request.username})
        const email = await User.findOne({ email : request.email })

        if(username) {
            const response = new Response.Error(true, 400, "Username Already Used")
            return res.status(400).json(response)
        }

        if(email) {
            const response = new Response.Error(true, 400, "Email Already Used")
            return res.status(400).json(response)
        }

        const hashPassword = await bcrypt.hash(request.password, 12)
        request.password = hashPassword

        const newUser = new User(request)
        const result = await newUser.save()

        const response = new Response.Success(false, 201, "User Success to Register", result)
        return res.status(201).json(response)
    } catch (error) {
        const response = new Response.Error(true, 400, error.message)
        return res.status(400).json(response)
    }
})

const loginUser = asyncHandler (async (req,res) => {
    try {
        const request = await loginValidator.validateAsync(req.body)
        const email = request.email
        const user = await User.findOne({ email })

        if(user && (await bcrypt.compare(request.password, user.password))) {
            const jwt = jwtToken.sign({
                user : {
                    id : user.id,
                    email : user.email,
                    username : user.useraname,
                    type : user.type
                }
            }, process.env.KEY, { expiresIn : 15000})
            
            const result = { id : user.id, token : jwt}
            const response = new Response.Success(false, 200, "Login Success", result)
            return res.status(200).json(response)
        } else {
            const response = new Response.Error(false, 400, "Username or Password not valid")
            return res.status(400).json(response)
        }
    } catch (error) {
        const response = new Response.Error(false, 400, error.message)
        return res.status(400).json(response)
    }
})

module.exports = { registerUser, loginUser }