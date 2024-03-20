const RoomType = require('../models/roomType-model')
const User = require('../models/user-model')
const Room = require('../models/room-model')
const {validationResult} = require('express-validator')
const roomController ={}
roomController.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const ownerId = req.user.id
    const id= req.params.id
    const {body} = req
    try{
        // find property based on ownerid and find roomtype based on property and id
        const beforeUpdate = await RoomType.findOne({_id:id})
        const roomType = await RoomType.findOneAndUpdate({_id:id},body,{new:true})
        if(!roomType || !beforeUpdate){
           return  res.status(404).json({error:"record not found"})
        }
        
        if(beforeUpdate.NumberOfRooms !== roomType.NumberOfRooms){
             await Room.deleteMany({roomTypeId:id})
            for(let i =0;i<roomType.NumberOfRooms;i++){
                await Room.create({roomTypeId:roomType._id,type:roomType.roomType})
            }
        }
        res.json('updated successfully')
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}
roomController.delete =async(req,res)=>{
    const ownerId = req.user.id
    const id =req.params.id
    try{
        const owner = await User.findOne({_id:ownerId})
        if(!owner){
            res.status(403).json({error:"you are not authorized to update this room"})
        }
        const room = await RoomType.findByIdAndDelete({_id:id})
        if(!room){
            return res.json({error:'record not found'})
        }
        await Room.deleteMany({roomTypeId:id})
        res.json(room)
    }catch(err){
        console.log(err)
        res.json({error:'internal server error'})
    }

}
module.exports = roomController