const Amenity = require('../models/amenities')
const _ = require('lodash')
const amenityController ={}
const {validationResult} = require('express-validator')
// create amenity 
amenityController.create =async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['name','type'])
     const amenity = await Amenity.findOne({name:body.name,type:body.type})
        if(amenity){
           return res.json('amenity already exists')
        }    
    try{
        const amenity = new Amenity(body)
        await amenity.save()
        res.status(201).json(amenity)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
    
}
// update the amenity
amenityController.update=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {id} = req.params
    const body= _.pick(req.body,['name','type'])
    try{
        const response = await Amenity.findOneAndUpdate({_id:id},body,{new:true})
        if(!response){
            return res.status(404).json({error:'record not found!'})
        }
        res.json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }

}
amenityController.destroy = async(req,res)=>{
    const {id} = req.params
    try{
        const response = await Amenity.findOneAndDelete({_id:id})
        if(!response){
            return res.status(404).json({error:'record not found !'})
        }
        res.json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})

    }
}


amenityController.list = async(req,res)=>{
    try{
       const amenities =  await Amenity.find()
       res.json(amenities)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}
amenityController.listOne = async(req,res)=>{
    const {id} = req.params
    try{
        const amenity = await Amenity.findOne({_id:id})
        if(!amenity){
            return res.status(404).json({error:'record not found!'})
        }
        res.json(amenity)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
}
module.exports = amenityController