const amenititiesValidationSchema ={
    name:{
        exists:{
            errorMessage:'amenity name field must exist'
        },
        notEmpty:{
            errorMessage:'amenity  name is required'
        }
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
        }
    }
}
module.exports = amenititiesValidationSchema