const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Address = require("../model/addressModel");
const Product = require("../model/ProductModel");
const Order = require("../model/orderModel");
const dateGenerator = require('../controller/dateGenerator')



const placeOrder = async (req,res) => {
      try {
            
     
      const user = req.session.user
      const userData = await User.findOne({_id:user})
      const cartId = req.body.cartId
      console.log('the cart id is',cartId);
      const paymentMethod = req.body.paymentMethod
      const price = req.body.price
      const addressId = req.body.radiovalue
      const findAddress = await Address.findOne({_id:addressId})
      const date = dateGenerator()
    

      if(paymentMethod == "COD"){
            const findCart = await Cart.findOne({_id:cartId}).populate('products.productId')
            const cartProduct = findCart.products.map((element=>{
                  let pdata = {
                  product:element.productId,
                  stock:element.quantity,
                  amount:element.price
                  }
                  return pdata;
            }))

            const order = new Order({
                  user:userData.email,
                  address:findAddress,
                  products:cartProduct,
                  totalamount:price,
                  paymentMethod:paymentMethod,
                  date:date
            })
            const myorder = await order.save()
            let productArray = []
        
            myorder.products.forEach(element => {
                let prodata = {
                    productId:element.product,
                    quantity:element.stock
                }
              
                productArray.push(prodata)
            });
           
            productArray.forEach(async(el)=>{
                  await Product.findByIdAndUpdate({_id:el.productId},{$inc:{stock:-el.quantity}})
            })
              const deleteCart = await Cart.findByIdAndDelete({_id:cartId})

              res.json({status:true})
      }
} catch (error) {
      console.log(error.message);      
}
}

const orderSuccess = async(req,res)=>{
      try {
            res.render('user/ordersuccess')
      } catch (error) {
            console.log(error.message);
      }
}

module.exports ={
      placeOrder,
      orderSuccess
}