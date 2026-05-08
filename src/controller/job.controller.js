const mongoose=require('mongoose')
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
const updateInterview=async(req,res)=>{
    const jobId=req.params.jobId
    const user=req.user.id
    const interviewId=req.params.interviewId
    try{
         const allowedFields = ['round', 'date', 'mode', 'interviewer', 'questions', 'outcome', 'notes']
         const update={}
         allowedFields.forEach(field=>{
            if(req.body[field]!==undefined){
                update[`interviews.$.${field}`] = req.body[field]
            }
         }
         )
             const job = await jobModel.findOneAndUpdate(
      { _id: jobId, user, 'interviews._id': interviewId },
      { $set: update },
      { new: true }
    )

    if (!job) {
      return res.status(404).json({ message: 'Job or interview not found' })
    }

    res.status(200).json({ message: 'Interview updated', job })
    }catch(err){
        console.log(err)
        return res.status(500).json(
            {
                message:"user not found"
            }
        )
    }
}

const getStats = async (req, res) => {
  try {
    const userId = req.user.id

    // Stage 1 — total count
    const total = await jobModel.countDocuments({ user: userId })

    // Stage 2 — count by status
    const byStatus = await jobModel.aggregate([
      { 
        $match: { user: new mongoose.Types.ObjectId(userId) } 
      },
      { 
        $group: { 
          _id: '$status',    // group by status field
          count: { $sum: 1 } // count each group
        } 
      },
      { 
        $sort: { count: -1 } // highest count first
      }
    ])

    // Stage 3 — calculate response rate
    // Response = anything beyond "applied" or "ghosted"
    const responded = await jobModel.countDocuments({
      user: userId,
      status: { $in: ['screening', 'interview', 'offer', 'rejected'] }
    })

    const responseRate = total > 0 
      ? ((responded / total) * 100).toFixed(1) + '%'
      : '0%'

    res.status(200).json({
      total,
      byStatus,
      responded,
      responseRate
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
module.exports={
    createJob,getJobs,getJob,updateJob,deleteJob,addInterview,addNote,getStats,updateInterview
}