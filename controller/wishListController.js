const User = require ('../model/userModel');
const Product = require ('../model/ProductModel');
const Cart = require ('../model/cartModel');
const Wishlist  = require ('../model/wishListModel');
const session = require("express-session");



////// Load WishList Page //////

const LoadWishlist = async (req,res) => {
      try {
            const findUser = req.session.user;
           //console.log("user iss",findUser);
           const findWishlist = await Wishlist.findOne({user:findUser._id}).populate('products.productId');
          // console.log("The wish list hereee....",findWishlist);
            

           res.render('user/WishList',{findWishlist}) 
      } catch (error) {
            console.log(error);
      }
}


///////// Add WishList //////

const addtoWishlist = async (req,res) => {
      try {
           // console.log("getting here");
            const {ProId} = req.body
            const userData = req.session.user;
            const ProData = await Product.findOne({_id:ProId})
            const findUser = await User.findOne({_id:userData});

            if (findUser) {
                  const WishlistModel = await Wishlist.findOne({ user: userData }); 
                  if (WishlistModel) {
                      const Product = await Wishlist.findOne({ user: userData, 'products.productId': ProId });
                      if (Product) {
                          res.json({ status: 'view Wishlist' });
                          //console.log("Product is already in Wishlist");
                      } else {
                          const wish = await Wishlist.findOneAndUpdate(
                              { user: userData },
                              {
                                  $push: { products: { productId: ProId } }
                              },
                              { new: true } 
                          );
                          res.json({ status: "view Wishlist" });
                      }
                  } else {
                      const userWishlist = await new Wishlist({
                          user: userData._id, 
                          products: [{ productId: ProId }]
                      });
                      await userWishlist.save();
                      res.json({ status: true });
                  }
              } else {
                  console.log("User not defined");
              }
              
      } catch (error) {
            console.log(error);
      }
}

////////// Delete Wishlist /////

const deleteWishlist = async (req,res) =>{
      try {
            const{proId} = req.body
  
      const user = req.session.user
      const product = await Product.findOne({_id:proId})
      console.log("deleted product" ,product)
      const deleteWishlist = await Wishlist.findOneAndUpdate({user:user._id},{$pull:{products:{productId:proId}}},{new:true})
      console.log("its here in the delete",deleteWishlist);

      res.json({status:true});

      } catch (error) {
            console.log(error.message);
      }
      


}

///// adding wishlist into Cart //////

 












module.exports = {
      LoadWishlist,
      addtoWishlist,
      deleteWishlist

}