const express = require("express");
const path=require("path")
const {addCategory,categories,oneCategory,updateCategory,deleteCategory}=require(path.join(__dirname,"..","controller","categoryController.js"))
const authToken=require(path.join(__dirname,"..","middleware","tokenMiddleware.js"))
const router=express.Router()

router.post("/categories",authToken,addCategory).get("/categories",authToken,categories).get("/categories/:id",authToken,oneCategory).patch("/categories/:id",authToken,updateCategory).delete("/categories/:id",authToken,deleteCategory)



module.exports=router

/*
http://localhost:2000/api/categories       -> POST
http://localhost:2000/api/categories       -> GET
http://localhost:2000/api/categories/:id   -> GET
http://localhost:2000/api/categories/:id   -> PATCH
http://localhost:2000/api/categories/:id   -> DELETE
*/ 