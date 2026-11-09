const mongoose=require("mongoose")


let pendingSignModel=new mongoose.Schema({
    name:String,
    email:String,
    role:{type:String,default:"user"},
    password:String,
    otp:Number,
    otpExp:Number,
    createdAt:{type:Date,default:Date.now}
})
module.exports=mongoose.model("PendingSign",pendingSignModel)