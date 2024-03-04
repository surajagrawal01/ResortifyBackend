const mongoose = require("mongoose")

const configDb = async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/Resortify2024")
        console.log('Successfull DB Connection ')
    }catch(err){    
        console.log('Error in DB Connection')
    }
}

module.exports = configDb;