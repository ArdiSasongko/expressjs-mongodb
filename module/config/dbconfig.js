const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler")

const configDB = asyncHandler (async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://admin:admin123@project.5x05tys.mongodb.net/expressjs-mongodb")
        console.log(`Database Connected ...`);
        console.log(`${conn.connection.host}, ${conn.connection.name}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
})

module.exports = configDB