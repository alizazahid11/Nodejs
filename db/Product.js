const mongoose=require('mongoose')

const ProdSchema=new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userId:String,
    company:String
    
})
module.exports=mongoose.model("add products",ProdSchema)