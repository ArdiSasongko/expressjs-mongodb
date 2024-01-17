const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const configDB = require("./module/config/dbconfig")
const errorHandling = require("./module/middleware/errorHandling")
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())

configDB()

app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())

app.get("/", (req,res) => {
    res.status(200).json("Response Success")
})
app.use(errorHandling)

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})