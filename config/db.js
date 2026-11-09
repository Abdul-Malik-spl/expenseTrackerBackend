const mongoose=require("mongoose")


async function dbconnect(){
try{
const con=await mongoose.connect(process.env.MONGODB_URI)
console.log("successfully db connect",con.connection.host)
}catch(err){
    console.log("mongo db connection failed",err.message)
    process.exist(1)
}
}
module.exports=dbconnect