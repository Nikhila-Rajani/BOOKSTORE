const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
      date:{
            type:Date,
            default:Date.now()
      },
      username:{
            type:String,
            required:true,
      },
      email:{
            type:String,
            required:true,
      },
      mobile:{
            type:Number,
            required:true,
      },
      password:{
            type:String,
            required:true,
      },
      referalcode:{
            type:String
      },
      is_blocked:{
            type:Boolean,
            default:false,
      }     
     
},{versionKey : false});

const User = mongoose.model("User",userSchema);
module.exports = User;