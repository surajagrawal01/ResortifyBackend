const {Schema,model} = require('mongoose')
const roomTypeSchema = new Schema({
    roomTypeId :Schema.Types.ObjectId,
    type:String
},{timestamps:true})
const Room= model ('Room',roomTypeSchema)
module.exports = Room