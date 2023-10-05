const jwt=require('jsonwebtoken');
const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        
        requried:true
    },
    lastname:{
        type:String,
        requried:true
    },
    email:{
        type:String,
        requried:true
    },
    password:{
        type:String,
        requried:true
    },
    score:{
        type:Number,
        
    },
    ctype:{
        type:String,
        default:"NONE"
    },
    incorrect:{
        type:Number,
        
    },
    examstatus:{
        type:[Boolean],
        default:[false,false],
    },
       
  
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//authentication jwt token
userSchema.methods.genrateAuthToken = async function(){
    try{
       let token =jwt.sign({_id:this._id},process.env.Skey);
       this.tokens=this.tokens.concat({token:token});
       await this.save();
       return token;
    }catch(err){
         console.log(err);
    }
}





const user=mongoose.model('USER',userSchema);

module.exports=user;