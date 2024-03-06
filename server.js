require("dotenv").config()
const express = require("express")
const cors = require("cors")
const {checkSchema} = require("express-validator")
const app = express()

app.use(express.json())

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


//listening requests
app.listen(3060, ()=>{
    console.log('Server runnning on port 3060')
})


