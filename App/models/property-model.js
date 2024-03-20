const {Schema,model} = require('mongoose')
const propertySchema = new Schema({
    ownerId:{
        type : Schema.Types.ObjectId,
        ref:'User'
    },
    totalRooms:Number,
    propertyName:String,
    propertyBuiltDate:Date,
    packages:[{
               package:String,
               price:String
            }],
    ownerEmail:String,
    isApproved:{
        type:Boolean,
        default:false
    },
    location:{
             houseNumber:String,
             locality:String,   
             area:String,
             pincode:String,
             city:String,
             state:String,
             country:String
            },
    geoLocation:{
        lat:String,
        lng:String
    },
    propertyAmenities:[Schema.Types.ObjectId], 
    propertyPhotos:[String],
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const Property = model('Property',propertySchema)
module.exports = Property