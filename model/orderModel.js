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
        required:true
    }
},{versionKey:false,timestamps:true})

module.exports = new mongoose.model('Order',orderSchema)