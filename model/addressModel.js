const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
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
    addresstype:{
        type:String
    }
} ,{versionKey:false})

const Address = mongoose.model('Address',addressSchema)
module.exports = Address