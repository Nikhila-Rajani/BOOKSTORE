const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
      name : {
            type : String,
            require : true
      },
      discription : {
            type : String,
            require : true
      },
      regularPrice : {
            type : Number,
            require : true
      },
      offerPrice : {
            type : Number,
            require : true
      },
      offerpercentage : {
            type : Number,
            require : true
      },
      image : {
            type : array,
            require : true
      },
      category : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Category',
            require :true
      },
      stock : {
            type : Number,
            require : true
      },
      is_blocked : {
            type : Boolean,
            require : true
      }

},{versionKey : false})

module.exports = mongoose.model("product",productSchema);