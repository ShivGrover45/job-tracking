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
const resendOTP=async(req,res)=>{
    const {email}=req.body
    try{
    const user=await userModel.findOne({
        email:email
    })
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
    if(user.isVerified){
        return res.status(401).json({message:"user is already verified"})
    }
    const otp=await otpService.saveOTP(email)
    await sendOTPEmail(email,otp)

    res.status(201).json({
        message:"OTP sent successfully"
    })
}catch(err){
    console.log(err)
    res.status(500).json(err)
}

}

const login=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await userModel.findOne({
        email:email
        })
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        if(!user.isVerified){
            return res.status(403).json({
                message:"User not Verified yet"
            })
        }
        const isMatched=await bcrypt.compare(password,user.password)
        if(!isMatched){
            return res.status(401).json({
                message:"Invalid Email or password"
            })
        }
        const token=jwt.sign({
            id:user._id
        },JWT_SECRET,{
            expiresIn:'1d'
        })
         res.cookie('token', token)
    
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal Server error"
        })
    }
}

module.exports={register,verifyOTP,resendOTP}