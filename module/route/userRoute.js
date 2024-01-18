const express = require("express")
const route = new express.Router()
const { registerUser, loginUser, editData, deleteUser } = require("../controller/userController")
const validateToken = require("../middleware/validateToken")

route.post("/register", registerUser)
route.post("/login", loginUser)
route.route("/:id").put(validateToken, editData)
route.route("/:id").delete(validateToken, deleteUser)

module.exports = route