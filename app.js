//library
const express=require('express')
require('dotenv').config() 
const mongoose=require('mongoose')
const cors=require('cors')

const app=express()

//router
const register=require('./routes/register')
const tokencheck=require('./middleware/tokencheck')
const invite=require('./routes/invite')
const profile=require('./routes/profile')


//mongoose
mongodburl=`mongodb+srv://adil:${process.env.mongopass}@cluster0.vakdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(mongodburl).then(()=>{
    console.log('mongoose connected')
}).catch((err)=>{
    console.log(err);
})

const port= process.env.PORT || 9000


// middlewares
app.use(express.json())
app.use(cors())
app.use('/account',register)
app.use('/api',tokencheck)
app.use('/api/invite',invite)
app.use('/api/profile',profile)


app.get('/',(req,res)=>{
    res.send("hiii")
})





app.listen(port,()=>{
    console.log(port+"running")
})