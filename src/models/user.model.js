const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    analysesUsedToday:{
        type:Number,
        default:0
    },
    analysesResetDate:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const userModel=mongoose.model('user',userSchema)

module.exports=userModel