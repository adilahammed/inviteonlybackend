const mongoose = require('mongoose')

const userschema= new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String},
    invite:{type:Array},
    joined:{type:Array},
    invitedby:{type:String}
})

const users=mongoose.model('users',userschema)

module.exports=users