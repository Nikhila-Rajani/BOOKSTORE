const User = require('../model/userModel');
const Coupon = require('../model/couponModel');
const Cart = require('../model/cartModel');
const generateCoupon = require('../controller/couponGenerator');


////////Loading add coupon page ///////////

const loadAddcoupon = async (req,res) => {
      try {
            res.render('admin/addCoupon');
      } catch (error) {
            console.log(error);
      }
}

////////////Creating New coupon //////////

const addCouponPost = async(req,res)=>{
      try{
            console.log("addcoupon nte ullil ndd tto");
            const{couponName,Startdate,Enddate,MinimumAmount, Percentage} = req.body
             //console.log("This is coupon nas me",couponName);
             //console.log("ellam undeyy",Startdate,Enddate,MinimumAmount,Presentage);
             const ExistingCoupon = await Coupon.findOne({cname:couponName});
             //console.log("The coupon is",ExistingCoupon);
             if(ExistingCoupon){
                  res.json({status:"exist"})
             }else if(MinimumAmount<800){
                  res.json({status:'minimum'})
             }else{
            console.log("create new coup..")
                  const couponcode = generateCoupon()
                  const newCoupon = new Coupon ({
                  name:couponName,
                  startdate:Startdate,
                  enddate:Enddate,
                  minimumpurchase:MinimumAmount,
                  code:couponcode,
                  percentage:Percentage

                  });
                  await newCoupon.save()
                  res.json({status:'creat'})
                  console.log("The newly added coupon",newCoupon);

                  
             }


      }catch(err){
            console.error(err.message)
      }
}



///////////Load all coupon or listing coupon ////////

const allCouponGet = async(req,res) => {
      try {
            const coupon = await Coupon.find({})
            res.render('admin/allCoupon',{coupon})
      } catch (error) {
            console.log(error.meesa
            );
      }
}

///////// block Coupon /////////

const blockCoupon = async(req,res) => {
      try {
            const{id} = req.body
            const coupon = await Coupon.findByIdAndUpdate(id,{isblocked:true});
            res.json({status:"blocked"})

      } catch (error) {
            console.log(error.message);
      }
}

//////// unblocking coupon //////////

const unblockCoupon = async (req,res) => {
      try {
            const{id} = req.body
            const coupon = await Coupon.findByIdAndUpdate(id,{isblocked:false});
            res.json({status:"unblocked"})

      } catch (error) {
            console.log(error.message);
      }
}


/////////// Delete Coupon ///////////////////

const deleteCoupon = async (req,res) => {
      try {
            const{id} = req.body
            const coupon = await Coupon.findByIdAndDelete(id);
            res.json({status:"deleted"})
      } catch (error) {
            console.log(error.message);
      }
}


module.exports = {
      loadAddcoupon,
      addCouponPost,
      allCouponGet,
      blockCoupon,
      unblockCoupon,
      deleteCoupon
}