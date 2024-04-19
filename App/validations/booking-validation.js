const {format} = require('date-fns')
const Property = require("../models/property-model")
const mongoose = require('mongoose')
const bookingValidaton = {
    propertyId: {
        notEmpty: {
            errorMessage: 'propertyId value is required'
        },
        isMongoId: {
            errorMessage: 'propertyId must be a mongodbId'
        },
        custom:{
            options:async function(val){
                    const property = await Property.findOne({_id:val})
                    if(!property){
                        throw new Error('propertyId must be a valid property')
                    }
                    return true
            }
        }
    },
    // userName: {
    //     exists: {
    //         errorMessage: 'name field is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'name field must have some value'
    //     },
    //     trim: true,
    //     isLength: {
    //         options: { min: 3, max: 20 },
    //         errorMessage: 'Username must be within 3 to 20 characters'
    //     },
    //     custom: {
    //         options: value => {
    //             // Check if the value contains only letters and spaces
    //             return /^[A-Za-z\s]+$/.test(value);
    //         },
    //         errorMessage: 'Name cannot contain numbers or symbols'
    //     },
       
    // },
    // bookingCategory: {
    //     trim: true,
    //     exists: {
    //         errorMessage: 'bookingCategory field is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'bookingCategory field must have some value'
    //     },
    //     isIn:{
    //         options:[['Day-Out','Night-Out','Whole-Day']],
    //         errorMessage:`booking Category must be one of three value 'dayout','nightout','wholeday'`
    //     }
    // },
    Date: {
        exists: {
            errorMessage: 'Date field is required'
        },
        notEmpty: {
            errorMessage: 'Date field must have some value'
        },
        isObject:{
            errorMessage:'Date field value must be an object'
        }
    },
    'Date.checkIn':{
        exists:{
            errorMessage:'Date field must have checkIn property with value'
        },
        notEmpty: {
            errorMessage: 'Date Checkin field must have some value'
        },
        isDate:{
            errorMessage:'Value of checkIn property must be a date'
        },
        custom:{
            options:function(val){
                if(format(new Date(val), 'dd/MM/yyyy') < format(new Date(), 'dd/MM/yyyy')){
                    throw new Error("checkIn date should be greater than or equal to today's date")
                }
                return true
            }
        }

    },
    'Date.checkOut':{
        exists:{
            errorMessage:'Date field must have checkout property with value'
        },
        notEmpty: {
            errorMessage: 'Date CheckOut field must have some value'
        },
        isDate:{
            errorMessage:'Value of checkOut property must be a date'
        },
        custom:{
            options:function(val, {req}){
                if(format(new Date(val),'dd/MM/yyyy') < format(new Date(req.body.Date.checkIn), 'dd/MM/yyyy')){
                    throw new Error("checkOut date should be greater than or equal to checkin date")
                }
                return true
            }
        }
    },
    guests:  {
        exists: {
            errorMessage: 'guests field is required'
        },
        notEmpty: {
            errorMessage: 'guests field must have some value'
        },
        isObject:{
            errorMessage:'guests field value must be an object'
        }
    },
    'guests.adult':{
        exists:{
            errorMessage:'guests field must have adult property with value'
        },
        notEmpty: {
            errorMessage: 'guests adult field must have some value'
        },
        isNumeric:{
            errorMessage:'Value of adult property must be a number'
        },
        custom:{
            options:function(val, {req}){
                if(val < 1){
                    throw new Error("Value of Adult must be atleast1")
                }
                return true
            }
        }
    },
    'guests.children':{
        exists:{
            errorMessage:'guests field must have children property with value'
        },
        notEmpty: {
            errorMessage: 'guests children field must have some value'
        },
        isNumeric:{
            errorMessage:'Value of children property must be a number'
        },
        custom:{
            options:function(val, {req}){
                if(val < 0){
                    throw new Error("Value of children must be a positive number")
                }
                return true
            }
        }
    },
    Rooms: {
        exists: {
            errorMessage: 'Rooms field is required'
        },
        notEmpty: {
            errorMessage: 'Rooms field must have some value'
        },
        isArray:{
            errorMessage:'Rooms field value must be an object'
        },
        custom:{
            options: function(value){
                value.forEach(ele =>{
                    if(typeof(ele) !== 'object'){
                        throw new Error('rooms must contain roomtype')
                    }
                    if(!mongoose.Types.ObjectId.isValid(ele.roomTypeId) ){
                        throw new Error('room type id must be valid mongo id')
                    }
                    if(typeof(ele.NumberOfRooms)!== 'number'){
                        throw new Error('number of rooms is a number')
                    }
                })
                return true
            }
        }
    },
    packages: {
        exists: {
            errorMessage: 'paackages field is required'
        },
        notEmpty: {
            errorMessage: 'paackages field must have some value'
        },
        isArray:{
            errorMessage:'paackages field value must be an array'
        }
    },
    // totalAmount: {
    //     exists: {
    //         errorMessage: 'totalAmount field is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'totalAmount field must have some value'
    //     },
    //     isNumeric:{
    //         errorMessage:'totalAmount field value must be an number'
    //     }
    // },
    // contactNumber:{
    //     exists: {
    //         errorMessage: 'contact number field is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'contact number field must have some value'
    //     },
    //     isNumeric:{
    //         errorMessage:'contact number field value must be an number'
    //     },
    //     isLength:{
    //         options:{min:10, max:10},
    //         errorMessage:'contact number must be of 10 digits only'
    //     }
    // }
}


const updateStatusValidation = {
    id:{
        in:['params'],
        isMongoId:{
            errorMessage:'must be a mongoId'
        }
    },
    status:{
        in:['query'],
        exists:{
            errorMessage:'status params is required'
        },
        notEmpty:{
            errorMessage:'status params must have some value'
        },
        isIn:{
            options:[['approved','notApproved']],
            errorMessage:'value can be approved  or notApproved'
        }
    }
}

const updateCheckInOutValidation = {
    id:{
        in:['params'],
        isMongoId:{
            errorMessage:'must be a mongoId'
        }
    },
    type:{
        in:['query'],
        exists:{
            errorMessage:'type params is required'
        },
        notEmpty:{
            errorMessage:'type params must have some value'
        },
        isIn:{
            options:[['isCheckedIn','isCheckedOut']],
            errorMessage:'value can be isCheckedIn  or isCheckedOut'
        }
    }
}

const bookingCancelSchema = {
    id:{
        in:['params'],
        isMongoId:{
            errorMessage:'must be a mongoId'
        }
    },
}

module.exports = {bookingValidaton, updateStatusValidation, updateCheckInOutValidation, bookingCancelSchema}