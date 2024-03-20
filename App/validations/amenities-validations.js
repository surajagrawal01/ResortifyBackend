const Amenity = require('../models/amenities')
const amenititiesValidationSchema ={
    name:{
        exists:{
            errorMessage:'amenity name field must exist'
        },
        notEmpty:{
            errorMessage:'amenity  name is required'
        },
        trim:true
    },
    type:{
        exists:{
            errorMessage:'type field is required'
        },
        notEmpty:{
            errorMessage:'type of amenity is required'
        },
        isIn:{
            options:[['property','room']],
            errorMessage:'amenity should be from either property or room'
        },
        trim:true
        
    }
}
module.exports = amenititiesValidationSchema