const User = require('../model/userModel');
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;
const product = require('../model/ProductModel');
const Order = require('../model/orderModel');

//////////admin login///////////////////////////////////////////////

const adminLogin = async (req,res)=>{
      try {
            res.render('admin/adminlogin')
            
      } catch (error) {
            console.log("Error in rendering admin login",error);
      }
}

//////////////verifying admin by using data from body////////////////////////////////////

const verifyAdmin = async (req,res)=>{
      try {
            const email = req.body.email;
            const password = req.body.password;
            if(email==adminEmail && password==adminPassword){
                  req.session.admin = email;
                  req.session.admin = password;
                  res.redirect('/admin/adminDashboard');
                 
                  
            }
            
      } catch (error) {
            console.log("Error in verifying admin",error);
            
      }
}

///////////function for adminDashboard/////////////////////
const adminDashboard = async (req,res)=>{
      try {
            res.render('admin/adminDashboard');
            
      } catch (error) {
            console.log(error);
            
      }
}

//////adminproduct////////////////
const adminproduct = async (req,res)=>{
      try {
            const Product = await product.find({})
            res.render('admin/adminproduct',{Product});
            
      } catch (error) {
            console.log(error);
            
      }
}

////////////loading admin user list//////////

const adminUser= async (req,res)=>{
      try {
            const userData = await User.find({})
            res.render('admin/adminUser',{userData});
            
      } catch (error) {
            console.log(error);
            
      }
}
////////////////////

const blockuser = async (req,res)=>{
      try {
           const id = req.query.id;
           const findUser = await User.findById({_id :id});

           if(findUser.is_blocked == false){
            const userData = await User.updateOne({_id:id},{is_blocked : true})
           }
            res.redirect('/admin/adminUser')
      } catch (error) {
            console.log("There was an error in blocking user",error);
            
      }
}

const unblockUser = async (req,res)=>{
      try {
            const id = req.query.id;
            const findUser = await User.findById({_id:id});
            
           if(findUser.is_blocked == true){
            const userData = await User.updateOne({_id:id},{is_blocked : false})
           } 
           res.redirect('/admin/adminUser')
            
      } catch (error) {
            console.log(error);
            
      }
}

// const toggleuser = async (req,res)=>{
//       try {
//            const id = req.query.id;
//            const findUser = await User.findById({_id :id});
//            findUser.is_blocked = !findUser.is_blocked
//            await findUser.save();
           

//             res.redirect('/admin/adminUser')
//       } catch (error) {
//             console.log("There was an error in blocking user",error);
            
//       }
// }

/////// Loading Order list page ///////////

const orderList = async (req,res) => {
      try {

            const order = await Order.find({})
            res.render('admin/orderList',{order})
            console.log("order",order);
      } catch (error) {
            console.log(error.message);
            
      }
}

////////Loading OrderDetails Page //////

const orderDetails = async (req,res) => {
      try {
            // console.log("ivdey ndeyyy")
            const id = req.query.id
            const order = await Order.findOne({_id:id}).populate('products.product')
            const user = await User.findOne({email:order.user})
            console.log('userrr',user);
            res.render('admin/orderDetails',{order,user})
            
      } catch (error) {
            console.log(error.message);
            
      }
}

////////////// Loading Sales REport page /////?////

const salesGet = async (req,res) => {
      try {
            const orderData = await Order.find({status:"Delivered"}).populate('user').sort({_id:-1});
            let orderCount = orderData.length
            let totalAmount = 0;
            orderData.forEach(order => {
                  totalAmount+=order.totalamount
              })

            res.render('admin/salesReport',{orderData,orderCount,totalAmount});
      } catch (error) {
            console.log(error);
      }
}

const filterSalesReportbyDate = async(req,res)=>{
      try{
        const {startDate,endDate} = req.body
        console.log(startDate);
        const parts = startDate.split("-");
        const parts2 = endDate.split("-")
        const day = parseInt(parts[2], 10);
        const day2 = parseInt(parts2[2], 10);

        const month = parseInt(parts[1], 10);
        const month2 = parseInt(parts2[1], 10);

        const rotatedDate = day + "-" + month + "-" + parts[0];
        const rotatedDate2 = day2 + "_" + month2 + "_" + parts2[0]
        console.log(rotatedDate);
        console.log(rotatedDate2);
      //   const startingDate = new Date(startDate)
      //   const endingDate = new Date(endDate)
         const filterData= await Order.find({
            status:"Delivered",
            date:{$gte: rotatedDate , $lte: rotatedDate2}
         })
         console.log(filterData)
         res.json({orders:filterData})
    
      }catch(err){
        console.log(err.message)
      }
    }
  
  

    const filteringDateRange = async (req, res) => {
      try {
          const { selectOption } = req.body;
          const today = new Date();
          let startDate, endDate;
  
          switch (selectOption) {
              case 'Daily':
                  startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                  endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                  break;
              case 'Weekly':
                  const dayOfWeek = today.getDay();
                  startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek, 0, 0, 0);
                  endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - dayOfWeek), 23, 59, 59);
                  break;
              case 'Monthly':
                  startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                  endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
                  break;
              case 'Yearly':
                  startDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
                  endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
                  break;
              default:
                  throw new Error('Invalid selectOption');
          }
  
          console.log(`Filtering orders from ${startDate.toISOString()} to ${endDate.toISOString()}.`);
  
          const filterData = await Order.find({
              status: 'Delivered',
              createdAt: { $gte: startDate, $lte: endDate }
          });
  
          res.json({ orders: filterData });
      } catch (err) {
          console.error("Error in filteringDateRange: ", err.message);
          res.status(500).send({ error: err.message });
      }
  };
  




module.exports ={
      adminLogin,
      verifyAdmin,
      adminDashboard,
      adminproduct,
      adminUser,
      blockuser,
      unblockUser,
      orderList,
      orderDetails,
      // toggleuser,
      salesGet,
      filterSalesReportbyDate,
      filteringDateRange

}