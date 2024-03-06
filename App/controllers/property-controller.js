const Property = require('../models/property-model')
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
    const body = _.pick(req.body,['totalRooms','propertyName','propertyBuiltDate','packages','contactNumber','ownerEmail','location','geoLocation','propertyAmenities','propertyPhotos'])
 
    try{
        const property = new Property(body)
        // property.propertyPhotos = req.file.filename
        // console.log(req.file.filename)
        // property.ownerId = req.user.id
        await property.save()
        res.status(201).json(property)

    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}


//update the information of resorts
propertyController.update =async(req,res)=>{
    const {id} = req.params
    const {body} = req
    try{
        const property = await Property.findOneAndUpdate({_id:id},body,{new:true})
        if(!property){
           return  res.status(404).json({error:'record not found!'})
        }
        res.json(property)
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
        res.json(property)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }

}
module.exports = propertyController