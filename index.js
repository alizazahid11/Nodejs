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
    //to remove password from registeration 
    result=result.toObject();
    delete result.password;
    res.send(result)
})
app.post('/login',async(req,res)=>{
    // res.send(req.body)
    if(req.body.password && req.body.email){
    let user = await User.findOne(req.body).select("-password");//we don't need password
    //finding only on data
    if(user){
   res.send(user)}
   else{
       res.send({result:"no user found"})
   }
}else{
    res.send({result:"no user found"})
}
})
app.listen(8000);