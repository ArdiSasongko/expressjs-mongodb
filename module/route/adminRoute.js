const express = require("express")
const route = new express.Router()
const { registerAdmin, loginAdmin } = require("../controller/adminController")

route.post("/register", registerAdmin)
route.post("/login", loginAdmin)

module.exports = route