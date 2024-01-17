const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    type : {
        type : String,
        default : "Admin",
        immutable : true
    },
    createdAt : {
        type : Date,
        default : Date.now 
    }
})

const adminModel = mongoose.model("Admin", adminSchema)

module.exports = adminModel