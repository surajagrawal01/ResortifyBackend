const mongoose = require("mongoose")

const configDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Successfull DB Connection ')
    }catch(err){    
        console.log(err)
        console.log('Error in DB Connection')
    }
}

module.exports = configDb;