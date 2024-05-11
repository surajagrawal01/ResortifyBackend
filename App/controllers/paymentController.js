const Payment = require('../models/payment-model')
const sendMail = require("../../Utility.js/nodemailer")
const { validationResult } = require('express-validator')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {pick} = require('lodash')
const BookingModel = require('../models/booking-model')
const Property = require('../models/property-model')
const paymentsCltr={}


paymentsCltr.pay = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = pick(req.body,['bookingId','totalAmount'])

    try{
        ///when authenticating the route
        // const bookingRecord = await BookingModel.findOne({bookingId:body.bookingId, userId:req.user.id})
        // if(!bookingRecord){
        //     return res.status(404).json({error:'record not found'})
        // }
        //create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        }) 
        
        //create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:body.bookingId
                    },
                    unit_amount:body.totalAmount * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
            customer : customer.id
        })
        
        //create a payment
        const payment = new Payment()
        payment.bookingId = body.bookingId
        payment.transactionId = session.id
        // payment.productName=body.productName
        payment.amount = Number(body.totalAmount)
        payment.paymentType = "card"
        await payment.save()
        res.json({id:session.id,url: session.url})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.successUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const paymentRecord = await Payment.findOne({transactionId:id})
        if(!paymentRecord){
            return res.status(404).json({error:'record not found'})
        }
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, {$set:{paymentStatus:'success'}},{new:true}) 
        const updatedBooking = await BookingModel.findOneAndUpdate({bookingId:updatedPayment.bookingId}, {$set:{isPaymentDone:'true'}}, {new:true})
        //only access one property instead of all and sendmail ton user and owner once payment done and remove the send mail otpion for isPayment true in booking controller
        const booking = await BookingModel.findOne({bookingId:updatedPayment.bookingId}).select(['_id', 'userId','propertyId']).populate('userId',['_id','email','name'])
        const property = await Property.findById(booking.propertyId).select(['_id','ownerId']).populate('ownerId', ['_id', 'email'])
        const userHTMLMsg = `
                    <p><b>Hi ${booking.userId.name} <br/> Payment Done Booking Successful ${updatedBooking.bookingId}. <br/> Thank you for choosing Resotify`
        const ownerHTMLMsg = `
                    <p><b>Hi <br/>Pyament Done Booking Confirmed for ${updatedBooking.bookingId}.`
        sendMail(booking.userId.email, userHTMLMsg, "Payment Successfull")
        sendMail(property.ownerId.email, ownerHTMLMsg, "Booking Confirmed")
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentsCltr.failedUpdate=async(req,res)=>{
    try{
        const id = req.params.id
        const paymentRecord = await Payment.findOne({_id:id})
        if(!paymentRecord){
            return res.status(404).json({error:'record not found'})
        }
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, {$set:{paymentStatus:'failure'}}) 
        const updatedBooking = await BookingModel.findOneAndUpdate({bookingId:updatedPayment.bookingId}, {$set:{isPaymentDone:'false'}},{new:true}) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

module.exports = paymentsCltr