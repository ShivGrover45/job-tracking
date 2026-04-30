const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userModel = require('../models/user.model')
const otpService = require('../services/otp.service')
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
        const otp=await otpService.saveOTP(email)
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

const verifyOTP=async(req,res)=>{
    const {email,otp}=req.body
    try{
        const isValid=await otpService.verifyOTP(email,otp)
        if(!isValid){
            return res.status(401).json({
                message:"Otp expired"
            })
        }
        await userModel.findOneAndUpdate({
            email
        },{isVerified:true})

        res.status(200).json({
            message:"User verified successfully"
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            err
        })
    }
}

module.exports={register,verifyOTP}