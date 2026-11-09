let path=require('path')
let transaction=require(path.join(__dirname,'..',"model","transaction.js"))

exports.addTransaction=async(req,res)=>{
let userId=req.user.id
let data=req.body
if(!category||!amount||!paymentMode||!type){
    return res.status(400).json({message:"please fill required fields"})
}
try{
let addData=new transaction({...data,userId})
await addData.save()
res.status(201).json({message:"new transaction add successfully"})
}catch(err){
res.status(500).json({message:err.message})
}

}

exports.getTransaction=async(req,res)=>{
    let userId=req.user.id
    try{
let transactionList=await transaction.find({userId})
if(transactionList.length==0){
    return res.status(200).json({message:"successfully fetch data",data:transactionList})
}
res.status(200).json({message:"fetch data successfully",data:transactionList})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getSingleTransaction=async(req,res)=>{
    let userId=req.user.id
    let transactionId=req.params.id
    if(!transactionId){
        return res.status(400).json({message:"transaction id not get"})
    }
    try{
        let findTransaction=await transaction.findOne({_id:transactionId,userId})
        if(!findTransaction){
            return res.status(404).json({message:"not found this transaction"})
        } 
        res.status(200).json({message:"successfully get",data:findTransaction})
    }catch(err){
res.status(500).json({message:err.message})
    }
}

exports.updateTransaction=async(req,res)=>{
let userId=req.user.id
let transactionId=req.params.id
let data=req.body
if(!transactionId){
    return res.status(400).json({message:"transaction id not get"})
}
try{
let updateData=await transaction.findOneAndUpdate({_id:transactionId,userId:userId},{$set:data},{new:true,runValidators:true})
if(!updateData){
    return res.status(404).json({message:"not updated ,not find transaction"})
}
res.status(200).json({message:"successfully updated",data:updateData})
}catch(err){
res.status(500).json({message:err.message})

}
}

exports.deleteTransaction=async(req,res)=>{
   let userId=req.user.id
   let transactionId=req.params.id
   if(!transactionId){
    return res.status(400).json({message:"transaction id not get"})
}
try{
let deleteData=await transaction.findOneAndDelete({_id:transactionId,userId:userId})
if(!deleteData){
    return res.status(404).json({message:"not updated ,not find transaction"})
}
res.status(200).json({message:"successfully updated",data:deleteData})
}catch(err){
res.status(500).json({message:err.message})

}
}
// userId category amount paymentMode type description