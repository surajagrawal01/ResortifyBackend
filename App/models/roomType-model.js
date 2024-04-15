const {Schema,model} = require('mongoose')
const roomSchema = new Schema({
			propertyId: Schema.Types.ObjectId,	
			roomType:String,
			NumberOfRooms:Number,
			roomDescription:String,
			smokingAllowed: Boolean,
			extraBed:Boolean,
			roomOcupancy:{
				type:{ adult:Number,children:Number},
				default:{adult:2,children:2}    
			} ,	
			baseRoomPrice:Number,
			photos : [String],
			availability:{startDate:Date,endDate:Date},
			roomAmentities: {
				type:[Schema.Types.ObjectId],
				ref:'Amenity'
			}
},{timestamps:true})
const RoomType = model('RoomType',roomSchema)
module.exports = RoomType