const asyncHandler = require("express-async-handler")
const Admin = require("../model/adminModel")
const Response = require("../model/response")
const adminValidator = require("../middleware/adminValidator")
const loginValidator = require("../middleware/loginValidator")
const jwtToken = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const registerAdmin = asyncHandler (async (req,res) => {
    try {
        const request = await adminValidator.validateAsync(req.body)

        const username = await Admin.findOne({ username : request.username })
        const email = await Admin.findOne({ email : request.email })

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

        const newAdmin = new Admin(request)
        const result = await newAdmin.save()

        const response = new Response.Success(false, 201, "Success Register Admin", result)
        return res.status(201).json(response)
    } catch (error) {
        const response = new Response.Error(true, 400, error.message)
        return res.status(400).json(response)
    }
})

const loginAdmin = asyncHandler (async (req,res) => {
    try {
        const request = await loginValidator.validateAsync(req.body)
        const email = request.email
        const user = await Admin.findOne({ email })

        if(email && (await bcrypt.compare(request.password, user.password))) {
            const jwt = jwtToken.sign({
                user : {
                    id : user.id,
                    email : user.email,
                    type : user.type
                }
            }, process.env.KEY, { expiresIn : 15000 })

            const result = { id : user.id, token : jwt}
            const response = new Response.Success(false, 200, "Login Success", result)
            return res.status(200).json(response)
        } else {
            const response = new Response.Success(true, 400, "Email or Passwoed not valid")
            return res.status(400).json(response)
        }
    } catch (error) {
        const response = new Response.Success(true, 400, error.message)
        return res.status(400).json(response)
    }
})

module.exports = { registerAdmin, loginAdmin }