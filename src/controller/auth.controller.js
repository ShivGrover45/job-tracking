const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userModel = require('../models/user.model')
const { saveOTP } = require('../services/otp.service')
const{sendOTPEmail,sendFollowUpReminder}=require('../services/mail.services')
const register=async(req,res)=>{
    const{username,email,password}=req.body
    try{
        const existingUser=await userModel.findOne({
        $or:[{email},{username}]
    })
    if(existingUser){
        return res.status(400).json({
            message:"username or email already exists"
        })
    }
        const hashedPassword=await bcrypt.hash(password,8)
        const reg=await userModel.create({
            username:username,
            email:email,
            password:hashedPassword
        })
        const otp=await saveOTP(email)
        await sendOTPEmail(email,otp)

        res.status(201).json({
            message:"Registration Successfull check email for verification"
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            err
        })
    }
}

module.exports=register