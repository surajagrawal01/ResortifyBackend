const _ = require("lodash")
const bcryptjs = require("bcryptjs")
const otpgenerator = require("otp-generator")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const User = require("../models/user-model")
const { validationResult } = require("express-validator")
const userCntrl = {}


//otp generation 
const OTP_LENGTH = 6
const OTP_CONFIG = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
}
const generateOTP = () => {
    const otp = otpgenerator.generate(OTP_LENGTH, OTP_CONFIG)
    return otp
}

//mailGeneration
const sendMail = (userMail, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    const html = `
<p><b>Hi <br/> Thankyou for registering to Rseortify,</b><br />Your otp ${otp}</p>
` 
    async function mailSend() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME, // sender address
            to: userMail, // list of receivers
            subject: "Registration Confirmation", // Subject line
            html: html, // html body
        });
    }
    mailSend().catch(console.error)
}

//to create a record
userCntrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() })
    }
    const body = _.pick(req.body, ['name', 'email', 'contactNo', 'password', 'role'])
    try {
        const user = new User(body)
        {
            const salt = await bcryptjs.genSalt()
            const encryptedPassword = await bcryptjs.hash(user.password, salt)
            user.password = encryptedPassword
        }
        {
            const otp = generateOTP()
            user.otp = otp
            sendMail(user.email, user.otp)
        }
        {
            const countRecords = await User.countDocuments()
            if (countRecords == 0) {
                user.role = 'admin'
            }
        }
        await user.save()
        res.status(201).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//to verify the email - otp verification
userCntrl.verifyEmail = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, otp } = _.pick(req.body, ['email', 'otp'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        if (user && user.otp != otp) {
            return res.status(400).json({ error: 'Invalid OTP' })
        }
        await User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } }, { new: true })
        res.send('Email Verified')
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//for resending OTP
userCntrl.resendOTP = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email } = _.pick(req.body, ['email'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        {
            const otp = generateOTP()
            sendMail(user.email, otp)
            await User.findOneAndUpdate({ email: user.email }, { $set: { otp: otp } }, { new: true })
            res.send('Otp ReSend')
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


//to lists all the records
userCntrl.lists = async (req, res) => {
    try {
        const users = await User.find()
        return res.json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//forgot password
userCntrl.forgotPassword = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { email, otp, password } = _.pick(req.body, ['email', 'otp', 'password'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        if (user && user.otp != otp) {
            return res.status(400).json({ error: 'invalid otp' })
        }
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(password, salt)
        await User.findOneAndUpdate({ email: email }, { $set: { password: encryptedPassword } }, { new: true })
        res.send('Password Updated')
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//to update user record
userCntrl.update = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { name, contactNo } = _.pick(req.body, ['name', 'contactNo'])
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        const user1 = await User.findOneAndUpdate({ _id: user._id }, { $set: { name: name, contactNo: contactNo } }, { new: true })
        res.json(user1)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


//to update the password
userCntrl.updatePassword = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const { password, newPassword } = _.pick(req.body, ['password', 'newPassword'])
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({ error: 'Invalid Password' })
        }
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(newPassword, salt)
        const user1 = await User.findOneAndUpdate({ _id: req.user.id }, { $set: { password: encryptedPassword } }, { new: true })
        res.json(user1)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


//to get the particular user record
userCntrl.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


//to delete the particular record
userCntrl.destroy = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id)
        if (!user) {
            return res.status(404).json({ error: 'record not found' })
        }
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//userCntrl login
userCntrl.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = _.pick(req.body, ['email', 'password'])
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: 'invali EmailId/Password' })
        }
        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return res.status(404).json({ error: 'invalid EmailId/Password' })
        }
        const tokenData = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, { expiresIn: '7d' })
        res.json({ token: token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}



module.exports = userCntrl