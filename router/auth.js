const jwt = require('jsonwebtoken');
const express = require('express');
const { findOne } = require('../model/userschema');
const router = express.Router();
const authenticate = require("../middelwares/authenticate");
const User = require("../model/userschema");
const bcrypt=require("bcryptjs");
const cookieparser = require("cookie-parser");


require("../conn.js");
const user = require("../model/userschema");
router.use(cookieparser());


router.get('/', (req, res) => {
  console.log(`this is the pareser cookie ${req.cookies.jwt}`);
  res.send("from router");
})

router.post('/api/scoring', async (req, res) => {

  const score = req.body.score; 
  const incorrect = req.body.incorrect;
  const ctype=req.body.ctype;
  const check=req.body.check;

  if(check=="SBC"){

  }
 
  try {
     //headertoken contain token
    const headertoken=req.headers['auth-token'];
    
    const verifyToken=jwt.verify(headertoken,process.env.Skey);
    // verifyToken contain user all data
    const rootuser= await User.findOne({_id:verifyToken._id});
    
   //it contain userid
    const userId = rootuser.id;
   
   
    const updatedResult = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set:{score},
        
      },
      {
        new:true
      },
    );
    const updatedResult2 = await User.findByIdAndUpdate(
      { _id: userId },
      {
      
        $set:{incorrect},
      },
      {
        new:true
      },
    );
    const updatedResult3 = await User.findByIdAndUpdate(
      { _id: userId },
      {
      
        $set:{ctype},
      },
      {
        new:true
      },
    );

    if(check=="SBC"){
      const updatedResult4 = await User.findByIdAndUpdate(
        { _id: userId },
        {
        
          $set:{'examstatus.0':true},
        },
        {
          new:true
        },
      );
      
    }
    
    if(check=="PBC"){
      const updatedResult4 = await User.findByIdAndUpdate(
        { _id: userId },
        {
        
          $set:{'examstatus.1':true},
        },
        {
          new:true
        },
      );
    }
   
   
    
  } catch (err) {
    console.log(err);
  }

})


//sign up page
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(422).json("please filled");
  }
  const score = -1;
  const incorrect=0;

  try {
    const userexist = await user.findOne({ email: email });

    if (userexist) {
      return res.status(200).json({ error: "email already exist" });
       

    }

    const User = new user({ firstname, lastname, email, password, score,incorrect });
    await User.save();
    res.status(201).json({ message: "registered sucessfully" });

  } catch (err) {
    console.log(err);
  }
})

//login page
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "fill all the details" });

    }

    const userlogin = await user.findOne({ email: email })



    if (userlogin) {
      const passwordcheck=await bcrypt.compare(password,userlogin.password);
      if (passwordcheck) {
        const token = await userlogin.genrateAuthToken();
       res.json({sucess:true, token: token});   
      } else {  
        res.status(400).json({ message: "invalid credentials" });
      }

    } else {
      res.status(400).json({ message: "Invalid data" });

    }


  } catch (err) {

    console.log(err);
  }
})

//topscorerpage
router.get("/scorer", (req, res) => {
  async function retrieveDocuments() {
    try {
      const documents = await User.find().sort({ score: -1 }).limit(10);
     const header=req.headers['auth-token'];
      console.log("from scoreer");
     console.log(header);
      res.send(documents);
    } catch (error) {
      console.error("Error retrieving documents:", error);
    }
  }
  
  retrieveDocuments();
})

router.get("/about", authenticate, (req, res) => {
 res.send( req.rootuser); 
})



module.exports = router;
