const dotenv=require("dotenv");
const mongoose=require("mongoose");
const User = require("./model/userschema");

dotenv.config({path:'./config.env'});
const DB=process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser:true, 
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connection sucesses");
   
}).catch((err)=>{
    console.log(err);
})




