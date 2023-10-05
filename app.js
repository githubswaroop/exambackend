const express=require("express");
const mongoose=require("mongoose");
const app=express();
const PORT =process.env.PORT || 3000;
const cors =require("cors");
const path=require("path");

require("./conn");
app.use(express.json());

const corsOpts = {
          // origin: 'http://localhost:3000',
        origin: ' https://aptitudeexam.vercel.app',
   // origin: 'https://lastmernazurefrontend.vercel.app',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    // allowedHeaders: ['Content-Type'],
    // exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

app.use(require("./router/auth"));

const user=require("./model/userschema");

app.get("/",(req,res)=>{
    
     res.send("home page");
})

// app.get("/about",(req,res)=>{
    
//     res.send("about page");
    
// })


app.get("/login",(req,res)=>{
    res.send("lg page");
})

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(PORT,()=>{  
    console.log("connection is okay");
})
