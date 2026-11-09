const path=require("path")
const pendingModel=require(path.join(__dirname,"..","model","pendingSignModel.js"))
const userModel=require(path.join(__dirname,"..","model","userModel.js"))
const tokenGenerate=require(path.join(__dirname,"..","helper","generateToken.js"))
const otpGen=require(path.join(__dirname,"..","helper","otpGenerate.js"))
const mailGen=require(path.join(__dirname,"..","helper","mailGen.js"))
const bcrypt=require("bcryptjs")


exports.pendingSign=async(req,res)=>{
let data=req.body
// console.log(data)
let arrReq=["name","email","password"]
let missing=[]
for(let inf of arrReq){
    if(!data[inf]){
        missing.push(inf)
    }
}
if(missing.length>0){
    res.status(400).json({message:`${missing} data missing`})
    missing=[]
    return
}
try{
let findData=await userModel.findOne({email:data.email})
if(findData){
    return res.status(409).json({message:`${findData.email} this mail already exist`})
}
let bcryptPassword=await bcrypt.hash(data.password,10)
    let otp=otpGen()
const ct=Date.now()
const expiretime=ct+5*60*1000
let ins=await pendingModel({...data,password:bcryptPassword,otp,otpExp:expiretime}).save()
//    console.log(ins)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           mailGen(data.email,otp)
let infor=await mailGen(data.email,otp,"sign")         
res.status(200).json({message:"email verification otp send to your mail"})
}catch(err){
res.status(500).json({message:err.message})
}
}

exports.otpSign=async(req,res)=>{
let {email,otp}=req.body
if(!email||!otp){
    return res.status(400).json({message:"please enter otp or try again"})
}
try{
    let findData=await pendingModel.findOne({email})
    if(!findData){
        return res.status(404).json({message:"something went wrong please again sign up"})
    }
    let alreadythere=await userModel.findOne({email})
    if(alreadythere){
        return res.status(409).json({message:"this user alrady there please login"})
    }
      if(!findData.otpExp||Date.now()>findData.otpExp){
    return res.status(401).json({message:"otp expired"})
   }
   if(Number(otp)!==findData.otp){
    return res.status(401).json({message:"otp invalid"})
   }
   await userModel({email:findData.email,name:findData.name,password:findData.password}).save()
   await pendingModel.deleteOne({_id:findData._id})
res.status(200).json({message:"successfully register"})
}catch(err){
res.status(500).json({message:err.message})
}
}

exports.login=async(req,res)=>{
let data=req.body
let arrReq=["email","password"]
let missing=[]
for(let inf of arrReq){
    if(!data[inf]){
        missing.push(inf)
    }
}
if(missing.length>0){
    res.status(400).json({message:`${missing} data missing`})
    missing=[]
    return
}
try{
let findData=await userModel.findOne({email:data.email})
if(!findData){
return res.status(401).json({message:"invalid email or password"})
}
let hashPassword=await bcrypt.compare(data.password,findData.password)
if(!hashPassword){
    return res.status(401).json({message:"invalid email or password"})
}
let token=tokenGenerate(findData)
if(!token){
    return res.status(401).json({message:"something went wrong try again"})
}
res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"strict"})
res.status(200).json({message:"login succesfully",token})
}catch(err){
    res.status(500).json({message:`${err.message}`})
}
}

exports.forgetPassword=async(req,res)=>{
    let {email}=req.body
    
    if(!email){
        return res.status(400).json({message:"please give valid credential"})
    }
    let findData;
    try{
    findData=await userModel.findOne({email})
    if(!findData){
        return res.status(401).json({message:"this user not found"})
    }
    let otp=otpGen()
const ct=Date.now()
const expiretime=ct+5*60*1000
findData.otp=otp
findData.otpExp=expiretime
await findData.save()
let info=await mailGen(email,otp,"fp")
res.status(200).json({message:"successfully otp send your mail"})
    }catch(err){
        if(findData){
            findData.otp=undefined
            findData.otpExp=undefined
            await findData.save()
        }
       return res.status(500).json({message:err.message})
    }
}

exports.passwordupdate=async(req,res)=>{
    let {email,otp,password}=req.body
   if(!email||!otp||!password){
    return res.status(400).json({message:`please give email,password,otp`})
   }
   try{
   const findUser=await userModel.findOne({email})
   if(!findUser){
    return res.status(401).json({message:"invalid email otp  credential"})
   }
   if(!findUser.otpExp||Date.now()>findUser.otpExp){
    return res.status(401).json({message:"otp expired"})
   }
   if(Number(otp)!==findUser.otp){
      return res.status(401).json({message:"invalid otp"})
   }
    let hash=await bcrypt.hash(password,10)
    findUser.password=hash
    findUser.otp=undefined
    findUser.otpExp=undefined
   await findUser.save()
    res.status(200).json({message:"successfully password update"})
   }catch(err){
    res.status(500).json({message:err.message})
   }
}

exports.dashboard=async(req,res)=>{
    let {id,role,iat,exp}=req.user
    try{
// if(Date.now()>exp){
//    return res.status(401).json({message:"Login time out please login again"})
// }
let findData=await userModel.findById(id).select("-password")
if(!findData){
    return res.status(404).json({message:"this user not find "})
}
res.status(200).json({message:"success",data:findData})
    }catch(err){
res.status(500).json({message:err.message})
    }
    
}


// async function deletemember(m){
//     try{
//         let s=await userModel.find({})
//         console.log(s)
  
//     return a
//     }catch(err){
//         console.log(err.message)
//     }
// }
// let ans=deletemember("abdulmalikspl@gmail.com")
// console.log(ans)

  // let data=await userModel.findOne({email:m})
    // console.log(data)
    // let a=await userModel.findByIdAndDelete(data._id)
    // console.log(a)