const { JsonWebTokenError } = require('jsonwebtoken')
const jobModel=require('../models/job.model')
const createJob=async(req,res)=>{
    const{company, role, jobUrl, appliedDate, followUpDate}=req.body

   try{
     const job=await jobModel.create({
        user:req.user.id,
        company,
        role,
        jobUrl,
        appliedDate,
        followUpDate
    })
    res.status(201).json({
        message:"job added",
        job
    })
   }catch(err){
    console.log(err)
    return res.status(500).json({
        err
    })
   }

}

const getJobs=async(req,res)=>{
    try
  {  const filter={user:req.user.id}
    const status=req.query.status
    if(status){
        filter.status=status
    }
    const jobs=await jobModel.find(filter).sort({createdAt:-1})
    res.status(200).json(
        {
            message:"job fetched successfully",
            jobs
        }
    )}catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getJob=async(req,res)=>{
    const user=req.user.id
    const id=req.params.id
    try{
        const job=await jobModel.findOne({_id:id,user:user})
        if(!job){
            return res.status(404).json({
                message:"Job not Found"
            })
        }
        res.status(200).json({
            message:"job fetched successfully",
            job
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"internal server error",
            err
        })
    }
}

const updateJob=async(req,res)=>{
    const id=req.params.id
    const {company,role,status,jobUrl,appliedDate,followUpDate}=req.body
    try{
        const update = {}
    if (company) update.company = company
    if (role) update.role = role
    if (status) update.status = status
    if (jobUrl) update.jobUrl = jobUrl
    if (appliedDate) update.appliedDate = appliedDate
    if (followUpDate) update.followUpDate = followUpDate
    const updatedJob=await jobModel.findOneAndUpdate({_id:id,user:req.user.id},update,{new:true})
    res.status(200).json({
        message:"Updated Successfully",
        updatedJob
    })
    }catch(err)
    {
        return res.status(500).json(
            err
        )
    }
}

const deleteJob=async(req,res)=>{
    const id=req.params.id
    const user=req.user.id
    try{
    const job=await jobModel.findOne({_id:id,user:user})
    if(!job){
        return res.status(404).json({
            message:"job not found"
        })
    }
    await jobModel.findOneAndDelete({_id:id,user:user})
    res.status(200).json(
        {
            message:"Deleted Successfully"
        }
    )
}catch(err){
    return res.status(500).json({
        err
    })
}
}

const addInterview=async(req,res)=>{
    const id=req.params.id
    const {round,date,mode,interviewer,questions,outcome,notes}=req.body
    try{
        const job=await jobModel.findOneAndUpdate({
            _id:id,user:req.user.id
        },{$push:{interviews:{round,date,mode,interviewer,questions,outcome,notes}}},{
            new:true
        })
        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }
        res.status(200).json({
            message:"Job added",
            job
        })
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
}

const addNote=async(req,res)=>{
    const id=req.params.id
    const user=req.user.id
    const {text}=req.body
    try{
        const job=await jobModel.findOneAndUpdate({_id:id,user:user},{$push:{notes:{text}}}
            ,{new:true}
        )
        if(!job){
            return res.status(404).json({
                message:"Job not found"
            })
        }
        res.status(200).json({
            message:"notes added",
            job
        })
    }catch(err){
        return res.status(500).json(
            {
                message:"Internal server error"
            }
        )
    }
}

module.exports={
    createJob,getJobs,getJob,updateJob,deleteJob,addInterview,addNote
}