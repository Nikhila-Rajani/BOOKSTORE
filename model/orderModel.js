const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type:String
    },
    address:{
      name:{
            type:String
        },
        mobile:{
            type:Number
        },
        address:{
            type:String
        },
        pin :{
            type:Number
        },
        location:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        country:{
            type:String
    
        },
        
    },
    products:[{
        product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
        },
        stock:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        productStatus:{
            type:Boolean,
            default:false
        }
    }],
   
    totalamount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Confirmed"
    },
    date:{
        type:String,
       
    }
},{versionKey:false,timestamps:true})

const Order = mongoose.model('order',orderSchema)
module.exports = Order