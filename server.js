require("dotenv").config()
const express = require("express")
const {checkSchema} = require('express-validator')
const multer = require('multer') //require multer
const cors = require("cors")
const app = express()

app.use(express.json())

const port = 3060
//databaseConfiguration
const configDb = require("./config/db")
configDb()

/////=>suraj

//authorization and authentication
const {authorizeUser, authenticateUser} = require("./App/middleware/auth")

//validationSchema
const {userRegistrationValidation, 
    verifyEmailValidationSchema, 
    resendOTPEmailValidationSchema, 
    loginValidationSchema} = require("./App/validations/user-validaiton")


//controllers
const userCntrl = require("./App/controllers/user-controller")

//routes users
app.post('/api/users',checkSchema(userRegistrationValidation), userCntrl.create )
app.post('/api/users/verifyEmail',checkSchema(verifyEmailValidationSchema), userCntrl.verifyEmail)
//for reverification of email while login and for forgot password mail to verify mail
app.post('/api/users/reVerifiyEmail',checkSchema(resendOTPEmailValidationSchema), userCntrl.resendOTP)
//for forgot password -> mail and otp and new password 
app.put('/api/users/forgotPassword',userCntrl.forgotPassword )
app.post('/api/users/login', checkSchema(loginValidationSchema), userCntrl.login)
//for update
app.put('/api/users', authenticateUser , userCntrl.update)
//for delete
app.delete('/api/users', authenticateUser, userCntrl.destroy)
//for updating password
app.put('/api/users/updatePassword', authenticateUser, userCntrl.updatePassword)
//for lists
app.get('/api/users',userCntrl.lists)
//for account
app.get('/api/users/account', authenticateUser, userCntrl.account)




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





//sufal


//listening requests
app.listen(port, ()=>{
    console.log('Server runnning on port'+port)
})


