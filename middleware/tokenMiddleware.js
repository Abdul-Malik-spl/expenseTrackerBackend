const jwt=require("jsonwebtoken")


const authToken=(req,res,next)=>{
// const token=req.headers.authorization?.split(" ")[1]
const token=req.cookies?.token||(req.headers.authorization?.startsWith("Bearer ")?req.headers.authorization.split(" ")[1]:null)
if(!token){
    return res.status(401).json({message:"token missing"})
}
try{
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decode;
    next()

}catch(err){
res.status(401).json({message:"invalid token"})
}
}

module.exports=authToken
