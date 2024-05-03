const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Address = require("../model/addressModel");
const Product = require("../model/ProductModel");
const session = require("express-session");
const Coupon = require("../model/couponModel");


/////load cart page /////


const userCart = async(req,res)=>{
      try{
            const findUser = req.session.user;
            const findCart = await Cart.findOne({user:findUser._id}).populate('products.productId')

            //console.log("ok kitti",findCart);
            res.render('user/userCart',{findCart})

      }catch(err){
            console.log(err.message);
      }
}




/////Adding elements to the cart page /////

const addtoCart = async(req,res)=>{
      try {
            const {proId,offerPrice} = req.body;
            const userData = req.session.user;
            const ProData = await Product.findOne({_id:proId});
            const findUser = await User.findOne({_id:userData});
            // console.log('hhh===>>>',findUser)
            if(findUser){
                  // console.log('kiiiii');
                  const cartData = await Cart.findOne({user:userData})
                  if(cartData){
                        console.log("kerittind");
                        const findProduct = await Cart.findOne({user:userData,'products.productId':proId})
                        // console.log('vannuu...gooys',findProduct);
                        if(findProduct){
                              res.json({status:'viewcart'})
                              console.log("Product is already on cart");

                        }else{
                              const ucData = await Cart.findOneAndUpdate({user:userData},{
                                    $push:{products:{
                                          productId:proId,
                                          quantity:1,
                                          price:offerPrice
                                    }},
                                    $inc:{total:offerPrice}
                              })
                              res.json({status:'viewcart'})

                        }

                  }else{
                      const userCart = await new Cart({
                        user:userData._id,
                        products:[{
                              productId:proId,
                              quantity:1,
                              price:offerPrice

                        }],
                        
                  }) 
                  userCart.total = offerPrice
                  await userCart.save()
                  res.json({status:true})
                  // console.log("cart created");

                  }
            }else{
                  console.log("elsil und");
            }
           
         
      } catch (error) {
            console.log(error);
            
      }
}


///////Quantity increment ////////
 const increment = async(req,res)=>{
      try {

            const user = req.session.user;
            const {id} = req.body;
            const quantity = parseInt(req.body.quantity);
            const findCart = await Cart.findOne({user:user,'products.productId':id})
            const productData = await Product.findById({_id:id});
            const stock = productData.stock;
            const price = productData.offerPrice;

            findCart.products.forEach(element=>{
                  if(element.productId == id){
                        if(element.quantity < stock){
                              if(element.quantity <10){
                                    element.quantity += 1
                                    findCart.total += price
                                    //console.log(findCart.total);
                                    res.json({status:"increment"})

                              }else{
                                    console.log("you reached limit");
                                    res.json({status:"limit"})

                              }

                        }else{
                              console.log('out of stock');
                              res.json({status:"Outofstock"})
                        }
                  }  
            })
            await findCart.save()

      } catch (error) {
            console.log(error);
            
      }
 }

 /////quantity  decrement /////

 const decrement = async(req,res)=>{
      try {
            //console.log("decremntil und tto");
            const user = req.session.user;

            const {id} = req.body;
            const quantity = parseInt(req.body.quantity);
            const findCart = await Cart.findOne({user:user,'products.productId':id})
            const productData = await Product.findById({_id:id});
            const stock = productData.stock;
            const price = productData.offerPrice;

            findCart.products.forEach(element =>{
                  if(element.productId == id){
                        if(element.quantity >1){
                              element.quantity -=1
                              findCart.total -= price
                              res.json({status:"decrement"})

                        }else{
                              res.json({status:"minimum"})
                              console.log("quantity is aready Zero");
                        }
                  }else{
                        console.log("Cannot find id decrement");
                  }
            })
            await findCart.save()
    
      } catch (error) {
            console.log(error);
            
      }

 }

 //////Deleting cart

const deletecart = async (req,res)=>{
      try {
            //console.log("ivida unde");
            const userId = req.session.user
            const {id,quantity} = req.body
            const findCart = await Cart.findOne({user:userId,'products.productId':id})
            if(findCart){
               const productTodelete = findCart.products.find(product => product.productId == id)
               const price = productTodelete.price
               const totalDecerement =  price*productTodelete.quantity
               const deleteItem = await Cart.updateOne(
                   {user:userId,'products.productId':id},
                   {
                       $pull:{products:{productId:id}},
                       $inc:{total: -totalDecerement}
                   }
               )
              //console.log('delete item from cart',deleteItem)
               res.json({status:"delete"})
            }else{
                  console.log('err.me');
            }
       
      } catch (error) {
          console.log(error);
          
      }
  }

  ////////////get checkout Page////////

  const checkOut = async (req,res) =>{
      try {
            const userId = req.session.user
            const findAddress = await Address.find({user:userId})
            const userCart = await Cart.findOne({user:userId}).populate('products.productId')
            const coupon = await Coupon.find({isblocked:false});
            res.render("user/userCheckout",{findAddress,userCart,coupon})
            
      } catch (error) {
            console.log(error);
            
      }
  }





module.exports = {
      userCart,
      addtoCart,
      increment,
      decrement,
      deletecart,
      checkOut

}