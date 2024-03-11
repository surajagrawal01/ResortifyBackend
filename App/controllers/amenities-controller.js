const Amenity = require('../models/amenities')
const amenityController ={}
const {validationResult} = require('express-validator')
// create amenity 
amenityController.create =async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {body} = req
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
    const {id} = req.params
    const {body} = req
    try{
        const amenity = await Amenity.findOne({_id:id})
        if(!amenity){
            return res.status(404).json({error:'record not found!'})
        }
        const response = await Amenity.findOneAndUpdate({_id:amenity._id},body,{new:true})
        res.json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }

}
amenityController.destroy = async(req,res)=>{
    const {id} = req.params
    try{
        const amenity = await Amenity.findOne({_id:id})
        if(!amenity){
            return res.status(404).json({error:'record not found !'})
        }
        const response = await Amenity.findOneAndDelete({_id:amenity._id})
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