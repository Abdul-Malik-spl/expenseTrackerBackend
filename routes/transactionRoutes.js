const path=require("path")
const {addTransaction,getTransaction,getSingleTransaction,updateTransaction,deleteTransaction}=require(path.join(__dirname,"..","controller","transactionController.js"))
const authToken=require(path.join(__dirname,"..","middleware","tokenMiddleware.js"))
const express=require("express")
const router=express.Router()

router.post("/transaction",authToken,addTransaction).get('/transaction',authToken,getTransaction).get('/transaction/:id',authToken,getSingleTransaction).patch('/transaction/:id',authToken,updateTransaction).delete('/transaction/:id',authToken,deleteTransaction)

module.exports=router

/*
/api/transaction      ->post
/api/transaction      -get
/api/transaction:id   -get
/api/transaction:id   -patch
/api/transaction:id   -delete
*/ 