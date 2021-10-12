const express=require('express')
const route=express.Router()
const userDB=require('../models/users')


route.post('/invite',(req,res)=>{
    let repeatflag=false
    if(req.body.inviteemail===""){
        return(res.json({status:"error",msg:"email should provide"}))
    }
    if(req.body.inviteemail.includes("@")){
        userDB.find({_id:req.user.id},{invite:{$elemMatch:{$eq:req.body.inviteemail}}})
            .then((result)=>{
                console.log(result[0].invite.length)
                if(result[0].invite.length ===0){
                    userDB.updateOne({_id:req.user.id},{$push:{invite:req.body.inviteemail}})
                        .then((result)=>{
                        res.json({status:"ok",msg:"invite success"})
                        console.log(result)
                        })
                        .catch((err)=>{
                        res.json({status:"error"})
                        })
                }else{
                    res.json({status:"error",msg:"you can't invite same email"})
                }               
            })
            .catch((err)=>{
                console.log(err)
            })
            
        
    }else{
        return(res.json({status:"error",msg:"email should provide"}))
        console.log("its should be email")
    }
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