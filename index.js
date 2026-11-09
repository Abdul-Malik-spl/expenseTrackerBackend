const express=require("express")
const dotenv=require("dotenv")
dotenv.config()

const path=require("path")
const cors=require("cors")
const userRouter=require(path.join(__dirname,"routes","userRoutes.js"))
const categoryRouter=require(path.join(__dirname,"routes","categoryRoutes.js"))
const transactionRouter=require(path.join(__dirname,"routes","transactionRoutes.js"))
const summeryRouter=require(path.join(__dirname,"routes","summeryRoutes.js"))
const cookie=require("cookie-parser")
const dbconnect=require(path.join(__dirname,"config","db.js"))

const app=express()
app.use(cookie())
app.use(cors({Credential:true}))
app.use(express.json())

app.use("/api",userRouter)
app.use("/api",categoryRouter)
app.use("/api",transactionRouter)
app.use("/api",summeryRouter)


let PORT=2000||process.env.PORT
dbconnect()
app.listen(PORT,()=>{
console.log("server start successfully",PORT)
})


