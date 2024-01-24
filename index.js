const express=require('express');
const cors=require('cors');
require('./db/config');
const  Product=require("./db/Product")
const app=express();
app.use(express.json());//middleware
const jwt=require('jsonwebtoken');
const jwtkey='e-comm'//keep this key a secret
const corsOptions = {
    origin: 'http://localhost:3000',  // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


const User = require('./db/User')
//for user
//---------------------------------------//
app.post("/register",async(req,res)=>{
    //steps to show api in mongodb
    let user =new User(req.body);
    let result=await user.save();
    //to remove password from registeration
    //jwt auth api authorization
    result=result.toObject();
    delete result.password;
    
    jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.status(500).send({ result: "Something went wrong" });
        } 
          res.send({ result, auth: token });
        
      });
})
app.post('/login',async(req,res)=>{
    // res.send(req.body)
    if(req.body.password && req.body.email){
    let user = await User.findOne(req.body).select("-password");//we don't need password
    //finding only on data
    if (user) {
        jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            res.status(500).send({ result: "Something went wrong" });
          } else {
            res.send({ user, auth: token });
          }
        });
      } else {
        res.status(404).send({ result: "User not found" });
      }
      
}else{
    res.send({result:"no user found"})
}
})
//for products
//---------------------------------------//
app.post("/addproduct",verifytoken,async(req,res)=>{
    let product=new Product(req.body);
    let result=await product.save();
    res.send(result)
})
app.get("/products",verifytoken,async(req,res)=>{
    const products=await Product.find();
    if(products.length>0){
        res.send(products)
    }
    else{
        res.send({result:"no product found"})
    }
})
app.delete("/product/:id",verifytoken,async(req,res)=>{
    let result=await Product.deleteOne({_id:req.params.id})
    res.send(result)
})
//getting data from update table 
app.get("/product/:id",verifytoken,async(req,res)=>{
  let result=await Product.findOne({_id:req.params.id})
  if(result){
      res.send(result)
  }else{
    res.send({"result":"no product found"})
  }
})
//update method 
app.put("/product/:id",verifytoken,async(req,res)=>{
let result=await Product.updateOne(
    {_id:req.params.id},
    {$set:req.body}
)
res.send(result)

})
//for search fetching data
app.get("/search/:key",verifytoken,async(req,res)=>{
    let result=await Product.find({
        "$or": [
            { "name": { $regex: new RegExp(req.params.key, 'i') },
            
         }
            
        
        ]
    });
    res.send(result);
    
})
//middleware for verification of jwt 
function verifytoken(req,res,next){
 let token=req.headers['authorization']
 if(token){
  token=token.split(' ')[1];
 
  jwt.verify(token,jwtkey,(err,valid)=>{
     if(err){
      res.status(401).send({result:"please provide valid token with header"})
     }else{
      next();
     }
  })
 }else{
   res.send({result:"please add token with header"})
 }
// console.log("middleware call if",token);

}
app.listen(8000);