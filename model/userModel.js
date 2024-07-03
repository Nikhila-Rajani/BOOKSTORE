const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
      date:{
            type:Date,
            default:Date.now()
      },
      username:{
            type:String,
      },
      email:{
            type:String,
            required:true,
      },
      mobile:{
            type:Number,
      },
      password:{
            type:String,
      },
      referalcode:{
            type:String
      },
      google_id:{
            type:String
      },
      is_blocked:{
            type:Boolean,
            default:false,
      }     
     
},{versionKey : false});

const User = mongoose.model("User",userSchema);
module.exports = User;