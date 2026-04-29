const mongoose=require('mongoose')

const connectDb=async()=>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("db connection successfull")
}

module.exports=connectDb