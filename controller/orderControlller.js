const Cart = require("../model/cartModel");
const User = require("../model/userModel");
const Address = require("../model/addressModel");
const Product = require("../model/ProductModel");
const Order = require("../model/orderModel");
const dateGenerator = require('../controller/dateGenerator');
const orderId = require('../controller/otpGenerate');
const Razorpay = require('razorpay');
const crypto = require('crypto')


const {keyId , keySecret} = process.env
let razorInstance = new Razorpay({ 
      key_id: keyId,
     key_secret: keySecret
   })


const placeOrder = async (req,res) => {
      try {
            
     
      const user = req.session.user
      const userData = await User.findOne({_id:user})
      const cartId = req.body.cartId
      const paymentMethod = req.body.paymentMethod
      const price = req.body.price
      const addressId = req.body.radiovalue
      const findAddress = await Address.findOne({_id:addressId})
      const date = dateGenerator()
      const orderIdGenerator = orderId()

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

      }else if(paymentMethod=="Razorpay"){
            const findCart = await Cart.findOne({_id:cartId}).populate('products.productId')
            const cartProduct = findCart.products.map((element=>{
                  let pdata = {
                  product:element.productId,
                  stock:element.quantity,
                  amount:element.price
                  }
                  return pdata;
            }))

            const newOrder = {
                  user:userData.email,
                  address:findAddress,
                  products:cartProduct,
                  totalamount:price,
                  paymentMethod:paymentMethod,
                  date:date
            }

            console.log("new order is",newOrder);

            var options = {
                  amount: price * 100,
                  currency: "INR",
                  receipt:""+orderIdGenerator
                  
                }
                //console.log("This is Options",options);

                razorInstance.orders.create(options, async(error,order)=>{
          
                  if(!error){
                      
                      res.json({status:"onlinepayment", razorpayOrder:order,orderDetails:newOrder})
                  }else{
                        console.log("RazorPay Failed");
                  //     res.json({status:'razorpayfailed'})
                  }
                })

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

//////loading Order details page //////

const orderDetails = async(req,res)=>{
      try {
            const user = req.session.user
            const userData = await User.findOne({_id:user._id});
            // console.log("userem kitti",userData);
            const order = await Order.find({user:userData.email})
            // console.log("Order kitti tto",order);
            res.render('user/orderDetails',{order})
            
      } catch (error) {
            console.log(error.message);
      }
}

//////Loading view Order Page////

const viewOrder = async (req,res) => {
      try {
            const id = req.query.id
            // console.log("iddddd",id);
            const order = await Order.findOne({_id:id}).populate('products.product')
            console.log("oderrrr",order);
            res.render('user/viewOrder',{order})
      } catch (error) {
            console.log(error.message);
      }
}

const userCancelOrder = async (req,res) => {
      try {
            //console.log('its heree');
            const id = req.body.id;
            //console.log('the id is ',id);
            const orders =  await Order.find({})
            //console.log(orders);
            const user = req.session.user;
            const order = await Order.findByIdAndUpdate({_id:id},
                  {$set:{status:"Cancelled"}}
            )
            await order.save()
            let productArray = []
            order.products.forEach(element =>{
                let prodata = {
                    productID:element.product,
                    quantity:element.stock,
                    
                }
                productArray.push(prodata)
            })
            //console.log(productArray)
            // productArray.forEach((el)=>{
            //       await Product.findByIdAndUpdate({_id:el.productId},{$inc:{stock:el.quantity}})
            // })
            for(let i=0;i<productArray.length;i++){
                        await Product.findByIdAndUpdate({_id:productArray[i].productID},{$inc:{stock:productArray[i].quantity}})
            }
            res.json({status:true})
      } catch (error) {
            console.log(error.message);
      }
}

const adminChangeStatus = async(req,res)=>{
      try {
            console.log('it herererere');
            const orderID = req.body.orderID
            const statusID = req.body.statusID
            const actualOrder = await Order.findOne({_id:orderID})
            if(actualOrder){
            const order = await Order.findByIdAndUpdate({ _id: orderID },
                  { $set: { status: statusID } }, { new: true })
              res.json({ status: true })
              if(order.status == "Cancelled"){
                  let productarray = []
                order.products.forEach((element) => {
                    let prodata = {
                        productID: element.product,
                        quantity: element.stock,
                        
                    }
                    productarray.push(prodata)
                })
                for(let i=0;i<productarray.length;i++){
                  await Product.findByIdAndUpdate({_id:productarray[i].productID},{$inc:{stock:productarray[i].quantity}})
              }
              }

              res.json({status:true})

            }else{
                  res.json({ status: false});
            }
      } catch (error) {
            console.log(error.message);
      }
}

////////////// user Order cancel individual /////////////

const cancelIndividual = async(req,res) => {
      try {
            const {productId,orderId,ProductPrice} = req.body
      const quantity = parseInt(req.body.ProductQuantity)
     
      const order = await Order.findOne({_id:orderId});
      const productCancel = order.products.find(product => product.product.toString()=== productId)
      productCancel.productStatus =  true
      order.totalamount -= ProductPrice
      order.save()
      const product = await Product.updateOne({_id:productId},{$inc:{stock:quantity}})
     // console.log("product is here man",product);
      res.json({status:"ok"});


      } catch (error) {
            console.log(error);
      }
      


   
}

////////Rzorpay Order Success ////////

const razorpaySuccess = async(req,res) => {
      try {
            //console.log("RazorSuccess nte ullil und tto");
            const findUser = req.session.user._id;
            const{response,cartId,orderDetails} = req.body;
      
            const userData = await User.findOne({email:req.session.user.email});
            if(userData){
                  let hmac = crypto.createHmac('sha256',keySecret);
                  hmac.update(response.razorpay_order_id+"|"+ response.razorpay_payment_id)
                  hmac=hmac.digest("hex")

                  if(hmac == response.razorpay_signature){
                        const orderGet = await Order.create(orderDetails)
                        console.log("llll",orderGet)
                        let productArray = []
        
                        orderGet.products.forEach(element => {
                            let prodata = {
                                productId:element.product,
                                quantity:element.stock,

                            }
                          
                            productArray.push(prodata)
                        });
                        productArray.forEach(async(el)=>{
                              await Product.findByIdAndUpdate({_id:el.productId},{$inc:{stock:-el.quantity}})
                        })
                          const deleteCart = await Cart.findByIdAndDelete({_id:cartId})
                          res.json({status:'success'})
                  }else{
                        console.log("There is error in Success");
                  }
                

            }

      } catch (error) {
            console.log(error);
            
      }
}

/////////// changing the status if the product is deliverded ////////////

const returnOrder = async(req,res) => {
      try {
            const{id} = req.body;
            console.log("its teh id in the  return order",id);
            const findOrder = await Order.findOne({_id:id})

            if(findOrder.status === "Delivered"){
                  const statusUpdate = await Order.findByIdAndUpdate(id,{$set:{status: "requested"}})
                  res.json({status:"return"})
            }else{
                  console.log("Its not delevered ");
            }

      } catch (error) {
            console.log(error);
            
      }
}



module.exports ={
      placeOrder,
      orderSuccess,
      orderDetails,
      viewOrder,
      userCancelOrder,
      adminChangeStatus,
      cancelIndividual,
      razorpaySuccess,
      returnOrder
      
      

}