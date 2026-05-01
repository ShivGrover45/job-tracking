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
    const {}=req.body
}

module.exports={
    createJob,getJobs,getJob
}