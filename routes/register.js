const express=require('express')
const route=express.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const users=require('../models/users')


privatekey=process.env.api_key


route.post('/create',async (req,res)=>{
    let inviteflag=false
    const {username,email,password,inviter}=req.body
    console.log(req.body)
    if(password.length<=6){
      return  res.json({status:"error"})
    }

    users.findOne({email:inviter},{invite:1}).then(async(result1)=>{
        console.log(result1.invite)
        result1.invite.map((a,i)=>{
            if(a===email){
                inviteflag=true
                result1.invite.splice(i,1)
            }    
        })
        console.log(result1.invite)
        if(inviteflag===true){
        
        hashpassword= await bcrypt.hash(password,10)
        users.create({
            username,
            email,
            password:hashpassword,
        }).then((result)=>{
            console.log(result);
            res.json({status:"created success fully"})
            users.updateOne({email:inviter},{invite:result1.invite,$push:{joined:email}})
            .then((upres)=>{
                console.log(upres)
            })

        }).catch((err)=>{
            if(err.code===11000){
                if(err.keyPattern.email===1){
                    res.json({status:"email already taken"})
                }
                if(err.keyPattern.username===1){
                    res.json({status:"username already taken"})
                }
                
            }else{
                res.json({err})
            }
            console.log(err);
            console.log(err.keyPattern);
        })
        }else{
            res.json({status:"your not invited"})
        }
    }).catch((err)=>{
        res.json({status:"your not invited"})
        console.log(err)
    })
})

route.get('/login',async(req,res)=>{
    console.log("logim");
    const {id,password}=req.query
    console.log(req.query);
    let result=[]
    try{
        result= await users.find({$or:[{email:id},{username:id}]})
        console.log(result);
    }catch(err){
        res.json({status:"usernot foundiii"})
        
        console.log("=======");
        throw(err)
    }
     if(result===[]){
        res.json({status:"error",msg:"email or password doesnt match"})
    }
    else if(result!==[]){
        if(result[0]){
        const checkpass=result[0].password
        try{
            const passmatch= await bcrypt.compare(password,checkpass)
            if(passmatch){
                
                const token=await jwt.sign({
                    id:result[0].id,
                    username:result[0].username
                },privatekey)
                res.json({status:"login success",token})
            }else{
                res.json({status:"error",msg:"email or password doesnt match"})
            }
        }catch(err){
            console.log(err);
                }
            }
            else{
                res.json({status:"error",msg:"email or password doesnt match"})

            }
            }

}

)


module.exports=route