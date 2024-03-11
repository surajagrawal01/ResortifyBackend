const {Schema,model} = require('mongoose')
const amenitySchema = new Schema({
    name:String,
    type:String
})
const Amenity = model('Amenity',amenitySchema)
module.exports = Amenity