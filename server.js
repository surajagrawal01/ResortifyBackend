require("dotenv").config()
const express = require("express")
const {checkSchema} = require('express-validator')
const multer = require('multer') //require multer
const cors = require("cors")
const app = express()

app.use(cors())
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
    loginValidationSchema, 
    forgotPasswordValidation,
    userUpdatingDetailsValidationSchema,
    userUpdatingPassword} = require("./App/validations/user-validaiton")


//controllers
const userCntrl = require("./App/controllers/user-controller")

//routes users
app.post('/api/users',checkSchema(userRegistrationValidation), userCntrl.create )
app.post('/api/users/verifyEmail',checkSchema(verifyEmailValidationSchema), userCntrl.verifyEmail)
//for reverification of email while login if not verified and for forgot password mail to verify mail
app.post('/api/users/reVerifiyEmail',checkSchema(resendOTPEmailValidationSchema), userCntrl.resendOTP)
//for forgot password -> mail and otp and new password 
app.put('/api/users/forgotPassword', checkSchema(forgotPasswordValidation), userCntrl.forgotPassword )
app.post('/api/users/login', checkSchema(loginValidationSchema), userCntrl.login)
//for update
app.put('/api/users', authenticateUser ,checkSchema(userUpdatingDetailsValidationSchema), userCntrl.update)
//for delete
app.delete('/api/users', authenticateUser, userCntrl.destroy)
//for updating password
app.put('/api/users/updatePassword', authenticateUser, checkSchema(userUpdatingPassword), userCntrl.updatePassword)
//for all users lists
app.get('/api/users',authenticateUser, authorizeUser(['admin']),userCntrl.lists)
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


// room controller
const roomController = require('./App/controllers/room-controller')
// reviews
const reviewController = require('./App/controllers/reviews-controller')

//booking-controller
const bookingCntrl = require("./App/controllers/booking-controller")



// property validation schema
const propertyValidationSchema = require('./App/validations/property-validations')
//amenities validation schema
const amenititiesValidationSchema = require('./App/validations/amenities-validations')

// room validation schema
const roomValidationSchema = require('./App/validations/room-validations')
// review validation schema
const reviewValidationSchema = require('./App/validations/review-validations')

//booking validation schema 
const {bookingValidaton, updateStatusValidation, updateCheckInOutValidation, bookingCancelSchema} = require('./App/validations/booking-validation')


//get all the resorts
app.get('/api/users/resorts',propertyController.list)
// get one resort
app.get('/api/users/resorts/:id',propertyController.listOne)
// create the resort
app.post('/api/owners/propertydetails',authenticateUser,authorizeUser(['owner']),upload.array('file',10),checkSchema(propertyValidationSchema),propertyController.create)
//update the resort
app.put('/api/owners/propertydetails/:id',authenticateUser,authorizeUser(['owner']),checkSchema(propertyValidationSchema),propertyController.update)
//delete the resort
app.delete('/api/owners/propertydetails/:id',authenticateUser,authorizeUser(['owner']),propertyController.delete)
// admin approval of the resort
app.put('/api/admin/propertydetails/:id',authenticateUser,authorizeUser(['admin']),propertyController.adminApprove)

// rooms api 
// update a room
app.put('/api/owners/propertydetails/rooms/:id',authenticateUser,authorizeUser(['owner']),checkSchema(roomValidationSchema),roomController.update)
// delete a room
app.delete('/api/owners/propertydetails/room/:id',authenticateUser,authorizeUser(['owner']),roomController.delete)


// post amenities
app.post('/api/owners/amenities',authenticateUser,authorizeUser(['admin']),checkSchema(amenititiesValidationSchema),amenityController.create)
// update amenities
app.put('/api/owners/amenities/:id',authenticateUser,authorizeUser(['admin']),checkSchema(amenititiesValidationSchema),amenityController.update)
// delete amenities
app.delete('/api/owners/amenities/:id',authenticateUser,authorizeUser(['admin']),amenityController.destroy)
//list all amenities 
app.get('/api/owners/amenities',authenticateUser,authorizeUser(['owner','admin']),amenityController.list)
//list one amentity
app.get('/api/owners/amenities/:id',authenticateUser,authorizeUser(['owner','admin']),amenityController.listOne)


//get one reviews of one property
app.get('/api/reviews/:id',reviewController.listOne)
// post the review 
app.post('/api/users/reviews/:id',authenticateUser,authorizeUser(['user']),upload.array('reviewImage',5),checkSchema(reviewValidationSchema),reviewController.create)
// update the review
app.put('/api/users/reviews/:id',authenticateUser,authorizeUser(['user']),checkSchema(reviewValidationSchema),reviewController.update)
//  delete a review
app.delete('/api/users/reviews/:id',authenticateUser,authorizeUser(['user']),reviewController.delete)

//bookingCntollers
//for booking 
app.post('/api/bookings', authenticateUser, authorizeUser(['user']),checkSchema(bookingValidaton), bookingCntrl.create)
//for changing booking status
app.put('/api/bookings/:id', authenticateUser, authorizeUser(['owner']), checkSchema(updateStatusValidation),  bookingCntrl.changeStatus)
//for changing checkedIn checkedOut
app.put('/api/bookings/in-out/:id', authenticateUser, authorizeUser(['owner']), checkSchema(updateCheckInOutValidation), bookingCntrl.changeCheckInOut )
//for cancellation
app.put('/api/bookings/cancellation/:id', authenticateUser, authorizeUser(['user']), checkSchema(bookingCancelSchema), bookingCntrl.cancellation )
//for all bookings
app.get('/api/bookings', authenticateUser, authorizeUser(['owner']), bookingCntrl.listBookings )
//for one booking
app.get('/api/bookings/:id', bookingCntrl.listOne )


//paymentCNtrl 
const paymentsCltr = require('./App/controllers/paymentController')

// app.post('/api/create-checkout-session',authenticateUser, authorizeUser(['user']), paymentsCltr.pay)
app.post('/api/create-checkout-session', paymentsCltr.pay)
app.put('/api/payments/:id/success', paymentsCltr.successUpdate)
app.put('/api/payments/:id/failed', paymentsCltr.failedUpdate)


app.listen(port, ()=>{
    console.log('Server runnning on port'+" "+port)
})


