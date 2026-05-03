const express=require('express')
const {register, verify_OTP, resendOTP, login, me} =require('../controller/auth.controller')
const auth=require('../middleware/auth.middleware')
const {body}=require('express-validator')

const authRouter=express.Router()


const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
]

authRouter.post('/register',registerValidation,register)
authRouter.post('/verify-otp',verify_OTP)
authRouter.post('/resend-otp',resendOTP)
authRouter.post('/login',loginValidation,login)
authRouter.get('/me',auth,me)

module.exports=authRouter