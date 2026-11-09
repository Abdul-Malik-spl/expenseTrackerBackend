const mongoose =require('mongoose')

let categorySchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    name:{type:String,required:true},
    type:{type:String,enum:["income","expense"],required:true},
    icon:{type:String,default:"tag"},
    color:{type:String,default:"#808080"},
    isDefault:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true},
},{timestamps:true})
module.exports=mongoose.model("Category",categorySchema)



