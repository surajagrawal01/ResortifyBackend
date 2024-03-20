const reviewValidationSchema={
	ratings:{
        in:['body'],
        exists:{
            errorMessage:"ratings is required"
        },
        notEmpty:{
            errorMessage:"ratings field is required"
        },
       
    },
    description:{
        in:['body'],
        exists:{
            errorMessage:"description is required"
        },
        notEmpty:{
            errorMessage:"description field is required"
        }
    },
    
}
module.exports =reviewValidationSchema