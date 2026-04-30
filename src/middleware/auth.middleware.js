const jwt=require('jsonwebtoken')
const auth=(req,res,next)=>{
    try{
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({
                message:"Unauthorized Access -no token"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        req.user=decoded
        next()

        
    }catch(err){
        console.log(err)
        return res.status(401).json({
            message:"Unauthorized -invalid token"
        })
    }
}

module.exports=auth