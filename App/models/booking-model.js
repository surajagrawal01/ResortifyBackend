const { model, Schema } = require("mongoose")

const bookingModel = new Schema({
    bookingId: String,
    userId: Schema.Types.ObjectId,
    propertyId: Schema.Types.ObjectId,	// Property model 
    userName: String,
    bookingCategory: String,
    Date: { checkIn: Date, checkOut: Date },
    guests: { adult: Number, children: Number },
    contactNumber: Number,
    Rooms: [{
        roomTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'RoomType'
        },
        NumberOfRooms: Number
    }],
    packages: {
        type: [
            {
                packId: Schema.Types.ObjectId,
                packageName: String
            }]
    },
    totalAmount: Number,
    status: String, //notApproved / approved 
    isPaymentDone: {
        type: String,
        default: false
    },
    isCheckedIn: {
        type: String,
        default: false
    },
    isCheckedOut: {
        type: String,
        default: false
    },
    isCancelled: {
        type: String,
        default: false
    },
    isDeleted: {
        type: String,
        default: 'false'
    }
}, { timestamps: true })

const BookingModel = model('BookingModel', bookingModel)

module.exports = BookingModel;