const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    name:String,
    email:String,
    contactNo:Number,
    password:String,
    role: String,
    otp:String,
    isVerified:{
        type:Boolean, 
        default:false
    }
})


const User = model('User',userSchema )

module.exports = User;