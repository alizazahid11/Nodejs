const express=require('express');
const cors=require('cors');
require('./db/config')
const app=express();
app.use(express.json());//middleware
const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


const User = require('./db/User')
app.post("/register",async(req,res)=>{
    //steps to show api in mongodb
    let user =new User(req.body);
    let result=await user.save();
    res.send(result)
})
app.listen(5000);