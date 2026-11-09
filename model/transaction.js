const mongoose=require('mongoose')

const transactionSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true},
    amount:{type:Number,required:true},
    paymentMode:{type:String,enum:["online","cash"],required:true},
    type:{type:String,enum:["income","expense"]},
    description:{type:String},
    date:{type:Date,default:Date.now}
    }
)
module.exports=mongoose.model("Transaction",transactionSchema)
