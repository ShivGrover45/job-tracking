const userModel=require('../models/user.model')
const{analyseResume}=require('../services/ai.services')

const analyse=async(req,res)=>{
    const{resumeText,jobDescription}=req.body
    try{
        const user=await userModel.findById(req.user.id)
        const today=new Date()
        const resetDate=new Date(user.analysesResetDate)
        if(today.toDateString()!==resetDate.toDateString()){
            user.analysesUsedToday=0
            user.analysesResetDate=today
        }
        if(user.analysesUsedToday>=3){
            return res.status(429).json({
                message:"Daily limit reached",
                resetAt:"tommorow"
            })
        }
        const result=await analyseResume(resumeText,jobDescription)
        user.analysesUsedToday+=1
        await user.save()
        res.status(200).json({
            analysesUsedToday:user.analysesUsedToday,
            analysesRemaining:3-user.analysesUsedToday,
            result
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

module.exports=analyse