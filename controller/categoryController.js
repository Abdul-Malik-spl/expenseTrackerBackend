const path=require("path")
const category = require("../model/category")
const Category=require(path.join(__dirname,"..","model","category.js"))

exports.addCategory=async(req,res)=>{
   let {id,role,iat,exp}=req.user
   let data=req.body
   if(!data.name||!data.type){
    return res.status(400).json({message:"please enter name and type"})
   }
   try{
let findDuplicate=await Category.findOne({userId:id,name:data.name.trim(),type:data.type})
if(findDuplicate){
    return res.status(409).json({message:"this category already exit"})
}
let cat=new Category({...data,userId:id,name:data.name.trim()})
await cat.save()
res.status(201).json({message:"successfully category created"})

   }catch(err){
res.status(500).json({message:err.message})
   }
}

exports.categories=async(req,res)=>{
    try{
        let {id}=req.user
        let {status}=req.query
 let filter={userId:id}
 if(status=="active"){
filter.isActive=true
 }else if(status=="inactive"){
filter.isActive=false
 }else if(status=="income"){
    filter.type="income"
 }else if(status=="expense"){
     filter.type="expense"
 }
 let categorieslist=await Category.find(filter)
 if(categorieslist.length==0){
return res.status(200).json({message:"No Categoris there please craete first",data:categorieslist})
 }
 res.status(200).json({message:"success fully get data",data:categorieslist})


    }catch(err){
res.status(500).json({message:err.message})
    }
   
}

exports.oneCategory=async(req,res)=>{
    let cid=req.params.id
    let userId=req.user.id
    try{
    if(!cid){
        return res.status(401).json({message:"missing category id please try again"})
    }
    let findData=await Category.findOne({userId,_id:cid})
    if(!findData){
        return res.status(404).json({message:"category not found"})
    }
    res.status(200).json({message:"successfully get",data:findData})
}catch(err){
    res.status(500).json({message:err.message})
}
}

exports.updateCategory=async(req,res)=>{
    let userId=req.user.id
    let uci=req.params.id
    let data=req.body
    try{
    if(!uci){
        return res.status(400).json({message:"update category id not get"})
    }
    // let findData=await Category.findOne({userId,_id:uci})
    // if(!findData){
    //     return res.status(404).json({message:"update category not found"})
    // }
    let udata=await Category.findOneAndUpdate({_id:uci,userId:userId},{$set:data},{new:true,runValidators:true})
    if(!udata){
        return res.status(404).json({message:"category not found"})
    }
    
res.status(200).json({message:"successfully update",data:udata})
}catch(err){
    res.status(500).json({messgae:err.message})
}
}

exports.deleteCategory=async(req,res)=>{
    let userId=req.user.id
    let dci=req.params.id
    try{
    if(!dci){
        return res.status(400).json({message:"delete request category id not get please try again"})
    }
    // let cdi=await Category.findOne({userId,_id:dci})
    // if(!cdi){
    //     return res.status(404).json({message:"delete category not found"})
    // }
    let deleteItem=await Category.findOneAndUpdate({_id:dci,userId:userId},{$set:{isActive:false}},{new:true})
   if(!deleteItem){
    return res.status(404).json({message:"category not found"})
   }
     res.status(200).json({message:"successfully deavtivate",deleteItem})
}catch(err){
    res.status(500).json({message:err.message})
}
}

// async function getGat(){
//     let data=await category.find({})
//     console.log(data)
// //         let data=await category.findByIdAndUpdate("6aedc01e0613896e81dbe6a2",{icon:"fast-food"})
// // console.log(data)
// }
// getGat()