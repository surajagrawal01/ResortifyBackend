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
        const properties = await Property.find({isDeleted:false, isApproved:true}) // find using isapproved 
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
        req.files.forEach((ele,i) =>{
           property.propertyPhotos[i] = ele.filename
        })
        property.ownerId = req.user.id
        const generalModel = new GenrealPropertyModel(generalmodelData)
        
        generalModel.propertyId = property._id

        // creating types of rooms
        const totalRoomTypes =[]
        roomTypesData.forEach( ele =>{
                totalRoomTypes.push({...ele,propertyId:property._id})
        })
        await RoomType.insertMany(totalRoomTypes)
        const roomTypes = await RoomType.find()
        roomTypes.forEach(async(ele) =>{
            for(let i=0; i< ele.NumberOfRooms;i++){
              await Room.create({roomTypeId:ele._id,type:ele.roomType})  // try to use insert many
            }
        })
        
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

    try{ 

         const property = await Property.findOneAndUpdate({_id:id,ownerId:req.user.id},body,{new:true})
          if(!property){
           return  res.status(404).json({error:'record not found!'})
        }  
        const generalModel = await GenrealPropertyModel.findOneAndUpdate({propertyId:property._id},generalmodelData,{new :true})
       
       res.json({property,generalModel})
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
        const property = await Property.findOne({_id:id,ownerId:req.user.id})
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
        const roomTypes= await RoomType.find({propertyId:property._id})
        const generalProperyData = await GenrealPropertyModel.findOne({propertyId:property._id})
        // get the rooms based on booking status
        res.json({property,generalProperyData,roomTypes})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }

}

// controller for admin to appprove the property
propertyController.adminApprove = async(req,res)=>{
        const {id} = req.params
        try{
            const property = await Property.findOneAndUpdate({_id:id},{$set:{isApproved:true}},{new:true})
            if(!property){
                res.status(404).json({error:'record not found'})
            }
            res.json(property)
        }catch(err){
            console.log(err)
            res.status(500).json({error:'internal server error'})
        }
}


module.exports = propertyController