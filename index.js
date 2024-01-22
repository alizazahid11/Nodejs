const express=require('express');
require('./db/config')
const app=express();
app.use(express.json());//middleware
const User = require('./db/User')
app.post("/register",async(req,res)=>{
    //steps to show api in mongodb
    let user =new User(req.body);
    let result=await user.save();
    res.send(result)
})
app.listen(5000);