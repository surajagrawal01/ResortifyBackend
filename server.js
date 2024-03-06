const express = require("express")
const {checkSchema} = require('express-validator')
const multer = require('multer') //require multer
const app = express()
app.use(express.json())

const port = 3060
//databaseConfiguration
const configDb = require("./config/db")
configDb()

//suraj






//sufal
//multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./public/images")
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({storage})

// property controlller
const propertyController = require('./App/controllers/property-controller')
// property validation schema
const propertyValidationSchema = require('./App/validations/property-validations')

//get all the resorts
app.get('/api/users/resorts',propertyController.list)
// get one resort
app.get('/api/users/resorts/:id',propertyController.listOne)
// create the resort
app.post('/api/owners/propertydetails',upload.single('file'),checkSchema(propertyValidationSchema ),propertyController.create)
//update the resort
app.put('/api/owners/propertydetails/:id',propertyController.update)
//delete the resort
app.delete('/api/owners/propertydetails/:id',propertyController.delete)



//listening requests
app.listen(port, ()=>{
    console.log('Server runnning on port'+port)
})


