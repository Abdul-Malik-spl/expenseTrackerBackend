const express = require("express");
const path=require("path")
const {pendingSign,otpSign,login,forgetPassword,passwordupdate,dashboard}=require(path.join(__dirname,"..","controller","userController.js"))
const authToken=require(path.join(__dirname,"..","middleware","tokenMiddleware.js"))
const router=express.Router()

router.post("/pendingSign",pendingSign).post("/otpSign",otpSign).post("/login",login).post("/forgetPassword",forgetPassword).post("/passwordupdate",passwordupdate)
router.get("/dashboard",authToken,dashboard)

module.exports=router

/*
http://localhost:2000/api/pendingSign    -> POST
http://localhost:2000/api/otpSign        -> POST
http://localhost:2000/api/login          -> POST
http://localhost:2000/api/forgetPassword -> POST
http://localhost:2000/api/passwordupdate -> POST
http://localhost:2000/api/dashboard      -> GET
*/ 
