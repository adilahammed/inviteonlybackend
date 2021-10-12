const express=require('express')
const route=express.Router()
const usersDB=require('../models/users')


route.get('/view',(req,res)=>{
    
    usersDB.findById(req.user.id,{_id:0,username:1,email:1,invitedby:1})
        .then((result)=>{
            console.log(result)
            res.json({status:"ok",msg:result})
        }).catch((err)=>{
            console.log(err)
            res.json({status:"error"})
        })
})




module.exports=route