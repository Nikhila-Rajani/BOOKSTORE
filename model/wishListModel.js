const mongoose=require("mongoose")

const wishlistSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                require:true
            },
            
        }
    ]
},{timestamps:true,versionKey:false})


module.exports=mongoose.model("Wishlist",wishlistSchema);