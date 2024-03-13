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
//amenity controller
const amenityController = require('./App/controllers/amenities-controller')
//booking-controller
const bookingCntrl = require("./App/controllers/booking-controller")

// property validation schema
const propertyValidationSchema = require('./App/validations/property-validations')
//amenities validation schema
const amenititiesValidationSchema = require('./App/validations/amenities-validations')
//booking validation schema 
const bookingValidaton = require('./App/validations/booking-validation')

//get all the resorts
app.get('/api/users/resorts',propertyController.list)
// get one resort
app.get('/api/users/resorts/:id',propertyController.listOne)
// create the resort
app.post('/api/owners/propertydetails',authenticateUser,authorizeUser(['owner']),upload.single('file'),propertyController.create)
//update the resort
app.put('/api/owners/propertydetails/:id',authenticateUser,authorizeUser(['owner']),propertyController.update)
//delete the resort
app.delete('/api/owners/propertydetails/:id',authenticateUser,authorizeUser(['owner']),propertyController.delete)


// post amenities
app.post('/api/owners/amenities',authenticateUser,authorizeUser(['admin']),checkSchema(amenititiesValidationSchema),amenityController.create)
// update amenities
app.put('/api/owners/amenities/:id',authenticateUser,authorizeUser(['admin']),checkSchema(amenititiesValidationSchema),amenityController.update)
// delete amenities
app.delete('/api/owners/amenities/:id',authenticateUser,authorizeUser(['admin']),amenityController.destroy)
//list all amenities 
app.get('/api/owners/amenities',authenticateUser,authorizeUser(['owner','admin']),amenityController.list)
//list one
app.get('/api/owners/amenities/:id',authenticateUser,authorizeUser(['owner','admin']),amenityController.listOne)

//bookingCntollers
//for booking 
app.post('/api/bookings', authenticateUser, authorizeUser(['user']),checkSchema(bookingValidaton), bookingCntrl.create)
//for changing booking status
app.put('/api/bookings/:id', authenticateUser, authorizeUser(['owner']),  bookingCntrl.changeStatus)
//for changing checkedIn checkedOut
app.put('/api/bookings/in-out/:id', authenticateUser, authorizeUser(['owner']), bookingCntrl.changeCheckInOut )
//for cancellation
app.put('/api/bookings/cancellation/:id', authenticateUser, authorizeUser(['user']), bookingCntrl.cancellation )
//for all bookings
app.get('/api/bookings', authenticateUser, authorizeUser(['owner']), bookingCntrl.listBookings )


app.listen(port, ()=>{
    console.log('Server runnning on port'+port)
})


