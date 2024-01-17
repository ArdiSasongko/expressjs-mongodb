const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : true
    },
    type : {
        type : String,
        default : "User",
        immutable : true
    },
    createdAt : {
        type : Data,
        deafult : Date.now
    }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel