const express = require("express")
const route = new express.Router()
const { registerUser, loginUser } = require("../controller/userController")

route.post("/register", registerUser)
route.post("/login", loginUser)

module.exports = route