const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
      user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'User'
      },
      walletAmount:{
          type:Number,
          default:0
      },
      transactions:[{
          id:{
              type:String,
  
          },
          amount:{
              type:Number
          },
          date:{ 
              type:Date,
              default:Date.now()
          },
          status:{
              type:String,
              
          },
          walletremarks:{
              type:String
          }
      }]
  },{versionKey:false});
  
  const Wallet = mongoose.model('Wallet',walletSchema);
  
  module.exports = Wallet