const User = require("../models/user-model")

const userRegistrationValidation = {
    name: {
        trim: true,
        exists: {
            errorMessage: 'name field is required'
        },
        notEmpty: {
            errorMessage: 'name field must have some value'
        },
        // isAlpha: {
        //     errorMessage: 'name field value must contain only alphabets'
        // },
        isLength: {
            options: { min: 3, max: undefined },
            errorMessage: 'name field value must be length greater than 3'
        },
        custom: {
            options: value => {
                // Check if the value contains only letters and spaces
                return /^[A-Za-z\s]+$/.test(value);
            },
            errorMessage: 'Name cannot contain numbers or symbols'
        },
    },
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        },
        custom: {
            options: async function (val) {
                const user = await User.findOne({ email: val })
                if (!user) {
                    return true
                } else {
                    throw new Error('EmailID already exists')
                }
            }
        }
    },
    contactNo: {
        trim: true,
        exists: {
            errorMessage: 'ContactNo field is required'
        },
        notEmpty: {
            errorMessage: 'ContactNo field must have contact number'
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'ContactNo field value must have 10 digits only'
        },
        isNumeric: {
            errorMessage: 'ContactNo field value must be a number'
        },
        custom: {
            options: async function (val) {
                const user = await User.findOne({ contactNo: val })
                if (!user) {
                    return true
                } else {
                    throw new Error('ContactNo already exists')
                }
            }
        }
    },
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password field value must be between 8-128 characters'
        },
        isStrongPassword: {
            errorMessage: 'password must have atleast one uppercase, one number and one special character'
        }
    },
    role: {
        exists: {
            errorMessage: 'role field is required'
        },
        notEmpty: {
            errorMessage: 'role field must have some value'
        },
        isIn: {
            options: [['admin', 'user', 'owner']],
            errorMessage: 'role field value can be either user/owner'
        },
    }
}

const verifyEmailValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    },
    otp: {
        exists: {
            errorMessage: 'otp field is required'
        },
        notEmpty: {
            errorMessage: 'otp field must have some value'
        },
        trim: true,
        isLength: {
            options: { min: 6, max: 6 },
            errorMessage: 'otp field value must be of 6 digits'
        },
        isNumeric: {
            errorMessage: 'otp value must be numbers only'
        }
    }
}

//for resending otp
const resendOTPEmailValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    }
}

//for forgot password 
const forgotPasswordValidation = {
    email:{
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    },
    otp: {
        exists: {
            errorMessage: 'otp field is required'
        },
        notEmpty: {
            errorMessage: 'otp field must have some value'
        },
        trim: true,
        isLength: {
            options: { min: 6, max: 6 },
            errorMessage: 'otp field value must be of 6 digits'
        },
        isNumeric: {
            errorMessage: 'otp value must be numbers only'
        }
    },
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password field value must be between 8-128 characters'
        },
        isStrongPassword: {
            errorMessage: 'password must have atleast one uppercase, one number and one special character'
        }
    }
}

const loginValidationSchema = {
    email: {
        exists: {
            errorMessage: 'email field is required'
        },
        notEmpty: {
            errorMessage: 'email field must have some value'
        },
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'email value must be in valid email format'
        }
    },
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password field value must be between 8-128 characters'
        }
    }
}

const userUpdatingDetailsValidationSchema = {
    name: {
        trim: true,
        exists: {
            errorMessage: 'name field is required'
        },
        notEmpty: {
            errorMessage: 'name field must have some value'
        },
        // isAlpha: {
        //     errorMessage: 'name field value must contain only alphabets'
        // },
        isLength: {
            options: { min: 3, max: undefined },
            errorMessage: 'name field value must be length greater than 3'
        },
        custom: {
            options: value => {
                // Check if the value contains only letters and spaces
                return /^[A-Za-z\s]+$/.test(value);
            },
            errorMessage: 'Name cannot contain numbers or symbols'
        },
    },
    contactNo: {
        trim: true,
        exists: {
            errorMessage: 'ContactNo field is required'
        },
        notEmpty: {
            errorMessage: 'ContactNo field must have contact number'
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'ContactNo field value must have 10 digits only'
        },
        isNumeric: {
            errorMessage: 'ContactNo field value must be a number'
        },
    }
}

const userUpdatingPassword = {
    password: {
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password field value must be between 8-128 characters'
        },
        isStrongPassword: {
            errorMessage: 'password must have atleast one uppercase, one number and one special character'
        }
    },
    newPassword:{
        exists: {
            errorMessage: 'password field is required'
        },
        notEmpty: {
            errorMessage: 'password field must have some value'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password field value must be between 8-128 characters'
        },
        isStrongPassword: {
            errorMessage: 'password must have atleast one uppercase, one number and one special character'
        }
    }
}


module.exports = {
    userRegistrationValidation,
    verifyEmailValidationSchema,
    resendOTPEmailValidationSchema,
    loginValidationSchema,
    forgotPasswordValidation,
 userUpdatingDetailsValidationSchema,
 userUpdatingPassword
}