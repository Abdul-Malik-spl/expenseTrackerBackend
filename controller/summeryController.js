const mongoose=require("mongoose")
const path=require("path")
const category = require("../model/category")
let transaction=require(path.join(__dirname,'..',"model","transaction.js"))
// const Category=require(path.join(__dirname,"..","model","category.js"))

exports.overAllSummery=async(req,res)=>{
    let userId=req.user.id

    try{
        let result=await transaction.aggregate([
            {
                $match:{
                    userId:new mongoose.Types.ObjectId(userId)
                }
            },{
                $group:{
                    _id:null,
                   totalIncome:{
                    $sum:{
                        $cond:[{$eq:["$type","income"]},"$amount",0]
                    }
                   },
                   totalExpense:{
                    $sum:{
                        $cond:[{$eq:["$type","expense"]},"$amount",0]
                    }
                   },
                  
                },
                $project:{
                    _id:0,
                    totaIncome:1,
                    totalExpense:1,
                    balance:{
                        $subtract:["$totalIncome","totalExpense"]
                    }
                }
            }
        ])
        let data=result[0]||{totalIncome:0,totalExpense:0,balance:0}
        res.status(200).json({messgae:"successfully get data",data})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.categorySummery=async(req,res)=>{
    let userId=req.user.id
    try{
let result=await transaction.aggregate([
    {
        $match:{
            userId:new mongoose.Types.ObjectId(userId)
        }
    },{
        $group:{
            _id:{
                category:"$category",
                type:"$type"
            },
            totalAmount:{
                $sum:"$amount"
            }
        }
    },{
        $lookup:{
            from:"categories",
            localField:"_id.category",
            foriegnField:"_id",
            as:"category"
        }
    },{
        $unwind:"$category"
    },{
        $project:{
            _id:0,
            category:"$_id.category",
            categoryName:"$category.name",
            type:"$_id.type",
            totalAmount:1
        }
    },{
    $sort:{
            totalAmount:-1
    }
    }
])
res.status(200).json({message:"success",data:result})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.monthlySummery=async(req,res)=>{
    try{
 let userId=req.user.id
 let year=Number(req.query.year)
 if(!Number.isInteger(year)||year<2000||year>2100){
    res.status(400).json({mesage:"please provide a valid year"})
 }
 const result =await transaction.aggregate([
    {
        $match:{
            userId:new mongoose.Types.ObjectId(userId),
            date:{
                $gte:new Date(`${year}-01-01T00:00:00+05:30`),
                $lt:new Date(`${year+1}-01-01T00:00:00+05:30`)
            }

        }
    },{
        $group:{
            _id:{
                $month:{
                    date:"$date",
                    timeone:"Asia/Kolkata"
                }
            },
            totalIcome:{
                $sum:{
                    $cond:[{$eq:["$type","income"]},"$amount",0]
                }
            },
            totalExpense:{
                $sum:{
                    $cond:[{$eq:["$type","expense"]},"$amount",0]
                }
            }
        }
    },{
        $project:{
            _id:0,
            month:"$_id",
            totalIncome:1,
            totalExpense:1
        }
    }
 ])
 res.status(200).json({message:`successfully fetch data ${year}`,data:result})
    }catch(err){
        res.status(500).json({message:err.message})

    }
}
