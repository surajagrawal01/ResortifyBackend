const Property = require('../models/property-model')
const GenrealPropertyModel = require("../models/general-property-model")
const RoomType = require('../models/roomType-model')
const Room = require('../models/room-model')
const {validationResult} = require('express-validator')
const _ = require('lodash')
const propertyController = {}


// list the resorts
propertyController.list =async(req,res)=>{
    try{
        const properties = await Property.find({isDeleted:false})
        res.json(properties)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}


// create the resorts
propertyController.create=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const body = _.pick(req.body,['totalRooms',
                                    'propertyName',
                                    'propertyBuiltDate',
                                    'packages',
                                    'contactNumber',
                                    'ownerEmail',
                                    'location',
                                    'geoLocation'
                                    ,'propertyAmenities'
                                    ,'propertyPhotos'])
    const generalmodelData =  _.pick(req.body,['bookingPolicies',
                                                'cancellationPolicies',
                                                'refundPolicies',
                                                'propertyRules',
                                                'financeAndLegal',
                                                'bankingDetails'])

    const {roomTypesData} = req.body
        
    try{
        const property = new Property(body)

        // property.propertyPhotos = req.file.filename //multer is remaining
        // console.log(req.file.filename)
        property.ownerId = req.user.id
        const generalModel = new GenrealPropertyModel(generalmodelData)
        
        generalModel.propertyId = property._id

        // creating types of rooms
        roomTypesData.forEach(async(ele)=>{
            const roomType = new RoomType(ele)
            roomType.propertyId = property._id
            for(let i =0; i< ele.NumberOfRooms; i++){
                Room.create({roomTypeId:roomType._id,type:ele.roomType})
             }
            await roomType.save()
        })
       

        const roomTypes = await RoomType.find()
        await property.save()
        await generalModel.save()

        res.status(201).json({property,generalModel,roomTypes}) //destructuring to display all the detal

    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}


//update the information of resorts
propertyController.update =async(req,res)=>{
    const {id} = req.params
    const body = _.pick(req.body,['totalRooms',
                                    'propertyName',
                                    'propertyBuiltDate',
                                    'packages',
                                    'contactNumber',
                                    'ownerEmail',
                                    'location',
                                    'geoLocation'
                                    ,'propertyAmenities'
                                    ,'propertyPhotos'])
const generalmodelData =  _.pick(req.body,['bookingPolicies',
                                            'cancellationPolicies',
                                            'refundPolicies',
                                            'propertyRules',
                                            'financeAndLegal',
                                            'bankingDetails'])

const {roomTypesData} = req.body
    try{ 

         const property = await Property.findOneAndUpdate({_id:id},body,{new:true})
          if(!property){
           return  res.status(404).json({error:'record not found!'})
        }  
        const roomdetails = await RoomType.findOne({propertyId:property._id}) //find unupdated room details 
        console.log(roomdetails)
        const updatedRoom = await RoomType.findOneAndUpdate({propertyId:property._id},roomTypesData,{new :true})
        const generalModel = await GenrealPropertyModel.findOneAndUpdate({propertyId:property._id},generalmodelData,{new :true})
       
      
       res.json({property,updatedRoom,generalModel})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}


// delete the property record
propertyController.delete = async(req,res) =>{
    const {id}= req.params
    const {type} = req.query
    try{
        const property = await Property.findOne({_id:id})
        if(!property){
          return res.status(404).json({error:'record not found!'})
        }
        if(type === 'soft'){
            const property = await Property.findOneAndUpdate({_id:id},{isDeleted:true},{new:true})
            return res.json(property)
        }else if(type === 'restore'){
            const property = await Property.findOneAndUpdate({_id:id},{isDeleted:false},{new:true})
            return res.json(property)    
         }else if(type === 'hard'){
             const property = await Property.findOneAndDelete({_id:id})
             return res.json(property)
         }
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal sever error'})
    }
}


// get one record of the resort
propertyController.listOne =async(req,res)=>{
    const {id} = req.params  // req.user.id
    try{
        const property = await Property.findOne({_id:id})
        const rooms = await Room.find({propertyId:property._id})
        const generalProperyData = await GenrealPropertyModel.findOne({propertyId:property._id})
        const roomtypes = await RoomType.find({roomTypeId:rooms._id})
        res.json({property,rooms,generalProperyData,roomtypes})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }

}
module.exports = propertyController