const roomValidationSchema ={
    NumberOfRooms:{
        notEmpty:{
            errorMessage:'number of rooms is  required'
        },
        isNumeric:{
            errorMessage:'number of rooms must be number'
        }
    },
    roomType:{
        notEmpty:{
            errorMessage:"room type cannot be empty"  
          },
          exists:{
            errorMessage:"room type field is required"
          }  
    },
    roomDescription:{
        notEmpty:{
            errorMessage:"room description is required"
        },
        exists:{
            errorMessage:"room description field is required"
        }
    },
    smokingAllowed:{
        notEmpty:{
            errorMessage:"room description is required"
        },
        exists:{
            errorMessage:"room description field is required"
        },
        isBoolean:{
            errorMessage:"must be a boolean value"
        }
    },
    extraBed:{
        notEmpty:{
            errorMessage:"extra bed option is required"
        },
        exists:{
            errorMessage:"extra bed field is required"
        },
        isBoolean:{
            errorMessage:"must be a boolean value"
        }
    },
    baseRoomPrice:{
        notEmpty:{
            errorMessage:"extra bed option is required"
        },
        exists:{
            errorMessage:"extra bed field is required"
        },
        isNumeric:{
            errorMessage:"base room price is number"
        }
    },
    photos:{
        notEmpty:{
            errorMessage:"extra bed option is required"
        },
        exists:{
            errorMessage:"extra bed field is required"
        }
    },
    availability:{
        notEmpty:{
            errorMessage:"availability field is required"
        },
        exists:{
            errorMessage:"availability field is required"
        },
        isObject:{
            errorMessage:"avalability is an object"
        },
        custom:{
            options: function(value){
                if(Object.keys(value).length === 0){
                    throw new Error("avalability cannot be empty")
                }
            }
        }
    },
    roomAmentities:{
        notEmpty:{
            errorMessage:"roomAmentities field is required"
        },
        exists:{
            errorMessage:"roomAmentities field is required"
        },
        isArray:{
            errorMessage:"roomAmentities should be an array"
        },
        custom:{
            options: function(value){
                value.forEach(ele =>{
                    if(!mongoose.Types.ObjectId.isValid(ele)){
                        throw new Error('not a valid mongoose id')
                    }
                })

            }
        }
    }

}
module.exports = roomValidationSchema