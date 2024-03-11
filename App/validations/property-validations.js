const mongoose = require('mongoose')
const Property = require('../models/property-model')
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
        custom:{
            options: async function(value){
                const property = await Property.findOne({ownerEmail:value})
                if(property){
                    throw new Error('email already exists')
                }
                return true
            }
        }
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
            options: async function (value){
                if(Object.keys(value).length != 2){
                    throw new Error('geolocation requires latitude and longitude')
                }
                 const property = await Property.findOne({geoLocation:{"lat":value.lat, "lng":value.lng}})
                  if(property){
                     throw new Error("property already exists")
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
        isArray:{
            errorMessage:'property amenity should be an array'
        },
        custom:{
            options:function(value){
                    if(value.length === 0){
                    throw new Error('amenities cannot be empty')
                }
                value.forEach(ele =>{
                    if(!mongoose.Types.ObjectId.isValid(ele)){
                        throw new Error('not a valid mongoose id')
                    }
                })
                
            return true
            }
        } 
    },
    bookingPolicies: {
        exists:{
            errorMessage:'bookingPolicies field is required'
        },
        notEmpty:{
            errorMessage:'bookingPolicies field should not empty'
        },
        isObject:{
            errorMessage:'bookingPolicies value must be an object'
        },
        custom:{
            options:function(value){
                if(Object.keys(value).length != 3){
                    throw new Error('Booking Policies first item must have 3 key value pairs')
                }
                return true
            }
        }
    },
    cancellationPolicies: {
        exists:{
            errorMessage:'cancellationPolicies field is required'
        },
        notEmpty:{
            errorMessage:'cancellationPolicies field should not empty'
        },
        isArray:{
            errorMessage:'cancellationPolicies value must be an array'
        },
        custom:{
            options:function(value){
                if(value.length < 1){
                    throw new Error('cancellationPolicies array must have at least one item')
                }
                return true
            }
        }
    },
    refundPolicies: {
        exists:{
            errorMessage:'refundPolicies field is required'
        },
        notEmpty:{
            errorMessage:'refundPolicies field should not empty'
        },
        isArray:{
            errorMessage:'refundPolicies value must be an array'
        },
        custom:{
            options:function(value){
                if(value.length < 1){
                    throw new Error('refundPolicies array must have at least one item')
                }
                return true
            }
        }
    },
    propertyRules:{
        exists:{
            errorMessage:'propertyRules field is required'
        },
        notEmpty:{
            errorMessage:'propertyRules field should not empty'
        },
        isObject:{
            errorMessage:'propertyRules value must be an object'
        },
        custom:{
            options:function(value){
                if(Object.keys(value).length != 2){
                    throw new Error('propertyRules must have 2 key value pairs')
                }
                return true
            }
        }
    },
    financeAndLegal: {
        exists:{
            errorMessage:'financeAndLegal field is required'
        },
        notEmpty:{
            errorMessage:'financeAndLegal field should not empty'
        },
        isObject:{
            errorMessage:'financeAndLegal value must be an object'
        },
        custom:{
            options:function(value){
                if(Object.keys(value).length != 2){
                    throw new Error('financeAndLegal must have 2 key value pairs')
                }
                return true
            }
        }
    },
    bankingDetails: {
        exists:{
            errorMessage:'bankingDetails field is required'
        },
        notEmpty:{
            errorMessage:'bankingDetails field should not empty'
        },
        isObject:{
            errorMessage:'bankingDetails value must be an object'
        },
        custom:{
            options:async function(value){
                if(Object.keys(value).length != 4){
                    throw new Error('bankingDetails must have 4 key value pairs')
                }
                // const generalProperyData = await GenrealPropertyModel.findOne({'bankingDetails.bankingAccountNumber' : value.bankingAccountNumber})
                // if(generalProperyData){
                //     throw new Error('Bank Account Number already exists')
                // }
                if(!(value.bankingAccountNumber.length >= 9 && value.bankingAccountNumber.length <= 18)){
                    throw new Error('Enter a valid account number')
                }
                if(value.IFSCCode.length != 11){
                    throw new Error('Enter a valid IFSC Code')
                }
                if(value.gstIN.length != 15){
                    throw new Error('Enter a valid GST NO')
                }
                if(value.panNo.length != 10){
                    throw new Error('Enter a Pan No')
                }
                return true
            }
        }
    },
    rooms:{
        isArray:{
            errorMessage:'rooms is an array'
        },
        custom:{
            options:function(value){
                if(value.length ==0){
                    throw new Error('rooms cannot be empty')
                }
                value.forEach(ele =>{
                    if(Object.keys(ele).length !== 2){
                        throw new Error('rooms should contain number of rooms and type ')
                    }
                })
                return true
            }
        }
    },
    // 'rooms.NumberOfRooms':{
    //     exists:{
    //         errorMessage:'number of rooms is required'
    //     },
    //     isNumeric:{
    //         errorMessage:'number of rooms expects a number'
    //     }

    // },
    roomDescription:{
        exists:{
            errorMessage:'room description field is required'
        }
    },
    baseRoomPrice:{
        exists:{
            errorMessage:'base room price field is required'
        },
        notEmpty:{
            errorMessage:'base room price is required'
        },
        isNumeric:{
            errorMessage:'room price is a number '
        }
    },
    availability:{
        isObject:{
            errorMessage:'availability is an object'
        },
        custom:{
            options: function(value){
                if(Object.keys(value).length !== 2){
                    throw new Error('availability has two fields start and end date')
                }
                return true
            }
        }
    },
    'availability.startDate':{
        exists:{
            errorMessage:'start date field is required'
        },
        notEmpty:{
            errorMessage:'startDate is required'
        },
        isDate:{
            errorMessage:'enter valid date format'
        }
    },
    'availability.endDate':{
        exists:{
            errorMessage:'end date field is required'
        },
        notEmpty:{
            errorMessage:'end date is required'
        },
        isDate:{
            errorMessage:'enter valid date format'
        }
    },
    roomAmentities:{
        exists:{
            errorMessage:'amenitites field is required'
        },
    notEmpty:{
        errorMessage:'* amenities is required'
    },
    isArray:{
        errorMessage:'room amenity should be an array'
    },
    custom:{
        options:function(value){
                if(value.length === 0){
                throw new Error('room amenities cannot be empty')
            }
            value.forEach(ele =>{
                if(!mongoose.Types.ObjectId.isValid(ele)){
                    throw new Error('not a valid mongoose id')
                }
            })
            
        return true
        }
    } 
    }
}
module.exports = propertyValidationSchema