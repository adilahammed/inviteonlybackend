const express=require('express')
const route=express.Router()
const userDB=require('../models/users')
route.post('/invite',(req,res)=>{
    if(req.body.inviteemail===""){
        return(res.json({status:"error",msg:"email should provide"}))
    }
    userDB.updateOne({_id:req.user.id},{$push:{invite:req.body.inviteemail}})
    .then((result)=>{
        res.json({status:"ok",msg:"invite success"})
        console.log(result)
    })
    .catch((err)=>{
        res.json({status:"error"})
    })
})

route.get('/invited',(req,res)=>{
    console.log("++++")
    id=req.user.id
    userDB.findById(id,{invite:1,joined:1}).then((result)=>{
        console.log(result)
        res.json({status:"ok",msg:{invited:result.invite,joined:result.joined}})
    }).catch((err)=>{
        res.json({status:"error"})
        console.log(err)
    })
})


module.exports=route