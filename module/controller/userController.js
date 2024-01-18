const asyncHandler = require("express-async-handler")
const User = require("../model/userModel")
const Response = require("../model/response")
const userValidator = require("../middleware/userValidator")
const loginValidator = require("../middleware/loginValidator")
const jwtToken = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userUpdateValidator = require("../middleware/userUpdateValidator")

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

const editData = asyncHandler(async (req, res) => {
    try {
      const realUser = req.user.id;
      const idUser = await User.findOne({ _id: req.params.id });
      const Admin = req.user.type;
  
      if (!idUser) {
        const response = new Response.Error(true, 404, "User Not Found");
        return res.status(404).json(response);
      }
  
      if (realUser.toString() === idUser._id.toString() || Admin === "Admin") {

        const request = await userUpdateValidator.validateAsync(req.body);
        const existingUsername = await User.findOne({ username: request.username });
  
        if (existingUsername && existingUsername._id.toString() !== idUser._id.toString()) {
          const response = new Response.Error(true, 400, "Username Already Used");
          return res.status(400).json(response);
        }
  
        if (request.password && request.password.length !== 0) {
          const hashPassword = await bcrypt.hash(request.password, 12);
          request.password = hashPassword;
        }
  
        const result = await User.findByIdAndUpdate(
          req.params.id,
          request,
          { new: true }
        );
  
        const response = new Response.Success(false, 200, "Update User Success", result);
        return res.status(200).json(response);
      } else {
        const response = new Response.Error(true, 401, "Unauthorized");
        return res.status(401).json(response);
      }
    } catch (error) {
      const response = new Response.Error(true, 400, error.message);
      return res.status(400).json(response);
    }
  });  

const deleteUser = asyncHandler (async (req,res) => {
    try {
        const realUser = req.user.id
        const idUser = await User.findOne({ _id : req.params.id})
        const Admin = req.user.type


        if(!idUser) {
            const response = new Response.Error(true, 404, "User Not Found")
            return res.status(404).json(response)
        }

        if(realUser === idUser || Admin === "Admin") {
            const result = await User.findOneAndDelete( idUser._id )
            const response = new Response.Success(false, 201, "Delete User Success", result)
            return res.status(201).json(response)
        }
    } catch (error) {
        const response = new Response.Error(true, 400, error.message)
        return res.status(400).json(response)
    }
})

module.exports = { registerUser, loginUser, editData, deleteUser }