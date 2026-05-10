const express=require('express')
const analyse=require('../controller/resume.controller')
const auth=require('../middleware/auth.middleware')
const resumeRouter=express.Router()

resumeRouter.post('/analyse',auth,analyse)

module.exports=resumeRouter