const express = require("express");
const path=require("path")
const {overAllSummery,categorySummery,monthlySummery}=require(path.join(__dirname,"..","controller","summeryController.js"))
const authToken=require(path.join(__dirname,"..","middleware","tokenMiddleware.js"))
const router=express.Router()

router.get("/overAllSummery",authToken,overAllSummery).get("/categorySummery",authToken,categorySummery).get("/monthlySummery",authToken,monthlySummery)

module.exports=router

/*
/api/overAllSummery"
/api/categorySummery
/api/monthlySummery
*/ 