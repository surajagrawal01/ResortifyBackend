
const propertyValidationSchema = {
    totalRooms:{
        in:['form-data'],
        exists:{
            errorMessage:'total rooms field is required'
        },
        notEmpty:{
            errorMessage:'* total rooms is required'
        },
        isNumeric:{
            errorMessage:'* total rooms should be a number'
        },
        escape:true
    },
    propertyName:{
        in:['form-data'],
        exists:{
            errorMessage:'property name field is required'
        },
        notEmpty:{
            errorMessage:'* property name is required'
        },
        trim:true,
        escape:true
    },
    propertyBuiltDate:{
        in:['form-data'],
        exists:{
            errorMessage:'date field is required'
        },
        notEmpty:{
            errorMessage:'* date is required'
        },
        escape:true,
        isDate:{
            errorMessage:'* enter valid date format'
        },
       
    },
    packages:{
        in:['form-data'],
        isArray:{
            errorMessage:'* package should be an array'
        },
        custom:{
            options: function(value){
                if(value.length === 0){
                    throw new Error('packages should not be empty')
                }
                value.foreach(ele =>{
                    if(Object.values(ele).length === 0){
                        throw new Error('package cannot be empty')
                    }
                })
                return true
            },
        }
    },
    contactNumber:{
        exists:{
            errorMessage:'contact number is required'
        },
        notEmpty:{
            errorMessage:'* contact number is required'
        },
        trim:true,
        custom:{
            options:function(value){
                if(value.length !== 10){
                    throw new Error('mobile number should be 10 digits')
                }
                return true
            }
        }
    },
    ownerEmail:{
        exists:{
            errorMessage:'email  is required'
        },
        notEmpty:{
            errorMessage:'* email is required'
        },
        isEmail:{
            errorMessage:'enter valid email format'
        },
        trim:true,
        escape:true,
    },
    location:{
        exists:{
            errorMessage:'location is required'
        },
        isObject:{
            errorMessage:'location is an object'
        },
        custom:{
            options:function(value){
                if(Object.keys(value).length ===0){
                    throw new Error('location cannot be empty')
                }
                if(value.pincode.length !== 6){
                    throw new Error('pincode must 6 digits')
                }
                return true
            }
        }
       
    },
    geoLocation:{
        exists:{
                errorMessage:'geolocation is required'
            },
        isObject:{
            errorMessage:'geolocation cannot be object'
        },
        custom:{
            options:function(value){
                if(Object.keys(value).length != 2){
                    throw new Error('geolocation requires latitude and longitude')
                }
                return true
            }
        }
       
    },
    propertyAmenities:{
     exists:{
                errorMessage:'amenitites field is required'
            },
        notEmpty:{
            errorMessage:'* amenities is required'
        },
        trim:true,
        escape:true,
        custom:{
            options:function(value){
                    if(value.length === 0){
                    throw new Error('amenities cannot be empty')
                }
            return true
            }
        } 
    }
}
module.exports = propertyValidationSchema