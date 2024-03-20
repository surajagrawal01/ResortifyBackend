const {Schema, model} = require('mongoose')

const paymentSchema = new Schema({
    userId:Schema.Types.ObjectId,
    propertyId:Schema.Types.ObjectId,
    bookingId:String,
    paymentType:String,
    amount:Number,
    date:Date,
    transactionId: {        //Session object id
        type: String,
        default: null
    },    
    paymentStatus:{
        type:String,
        enum:['pending','success','failure'],
        default:'pending'
    }
},{timestamps:true})

const Payment = new model('Payment',paymentSchema)

module.exports = Payment
