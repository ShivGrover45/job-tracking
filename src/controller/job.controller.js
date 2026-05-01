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