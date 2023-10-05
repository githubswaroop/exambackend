const jwt=require('jsonwebtoken');
const User=require("../model/userschema");

const Authenticate= async (req,res,next)=>{
  try{
    const headertoken=req.headers['auth-token'];
    const verifyToken=jwt.verify(headertoken,process.env.Skey);
    const rootuser= await User.findOne({_id:verifyToken._id});
    
     // const token=req.cookies.jwt;
     // const verifyToken=jwt.verify(token,process.env.Skey);  
     // const rootuser= await User.findOne({_id:verifyToken._id});
    
    // if(!rootuser){ throw new Error ('user not found')}
    //  req.token=token;
     req.rootuser=rootuser;
    //  req.userID=rootuser._id;
     next();
     
  }catch(err){
    res.send("unotherised:no token provided");
    console.log(err);
    
  }
}

module.exports= Authenticate;
