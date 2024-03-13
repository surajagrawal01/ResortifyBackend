const reviewValidationSchema={
    photos:{
        exists:{
            errorMessage:"photos field is required"
        }
    },
	ratings:{
        exists:{
            errorMessage:"ratings is required"
        },
        notEmpty:{
            errorMessage:"ratings field is required"
        },
        isNumeric:{
            errorMessage:"ratings is number"
        }
    },
    description:{
        exists:{
            errorMessage:"description is required"
        },
        notEmpty:{
            errorMessage:"description field is required"
        }
    }    
}
module.exports =reviewValidationSchema