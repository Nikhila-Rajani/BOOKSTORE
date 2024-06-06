const User = require('../model/userModel');
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;
const product = require('../model/ProductModel');
const Order = require('../model/orderModel');
const offer = require('../model/offerModel');
const category = require('../model/CategoryModel');
const { isBlocked } = require('../middleware/userAuth');

//////////admin login///////////////////////////////////////////////

const adminLogin = async (req, res) => {
      try {
            res.render('admin/adminlogin')

      } catch (error) {
            console.log("Error in rendering admin login", error);
      }
}

//////////////verifying admin by using data from body////////////////////////////////////

const verifyAdmin = async (req, res) => {
      try {
            const email = req.body.email;
            const password = req.body.password;
            if (email == adminEmail && password == adminPassword) {
                  req.session.admin = email;
                  req.session.admin = password;
                  res.redirect('/admin/adminDashboard');


            }

      } catch (error) {
            console.log("Error in verifying admin", error);

      }
}

///////////function for adminDashboard/////////////////////
const adminDashboard = async (req, res) => {
      try {
            const orders = await Order.find({ status: "Delivered" })
            const totalOrders = await Order.find({ status: "Delivered" }).count();
            const totalProduct = await product.find({}).count();
            const totalCategory = await category.find({}).count();
            const totalUsers = await User.find({}).count();





            let profit = 0
            orders.forEach(Order => {
                  profit += Order.totalamount
            })

            const bestSellingProducts = await Order.aggregate([
                  { $match: { status: 'Delivered' } },
                  { $unwind: '$products' },
                  {
                        $group: {
                              _id: '$products.product',
                              totalQuantity: { $sum: '$products.stock' }
                        }
                  },
                  { $sort: { totalQuantity: -1 } },
                  { $limit: 10 },
                  {
                        $lookup: {
                              from: 'products',
                              localField: '_id',
                              foreignField: '_id',
                              as: 'productInfo'
                        }
                  },
                  { $unwind: '$productInfo' },
                  {
                        $project: {
                              name: '$productInfo.name',
                              images: '$productInfo.image',
                              price: '$productInfo.offerPrice',
                              totalQuantity: 1
                        }
                  }
            ]);


            const topCategories = await Order.aggregate([
                  { $match: { status: 'Delivered' } },
                  { $unwind: '$products' },
                  {
                        $lookup: {
                              from: 'products',
                              localField: 'products.product',
                              foreignField: '_id',
                              as: 'productInfo'
                        }
                  },
                  { $unwind: '$productInfo' },
                  {
                        $lookup: {
                              from: 'categories',
                              localField: 'productInfo.category',
                              foreignField: '_id',
                              as: 'categoryInfo'
                        }
                  },
                  { $unwind: '$categoryInfo' },
                  { $group: { _id: '$categoryInfo._id', totalQuantity: { $sum: '$product.stock' } } },
                  { $sort: { totalQuantity: -1 } },
                  { $limit: 10 },
                  { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
                  { $unwind: '$category' },
                  { $project: { name: '$category.name', totalQuantity: 1 } }
            ])



            //console.log(bestSellingProducts,"tttttttt")



            res.render('admin/adminDashboard', {
                  orders,
                  totalProduct,
                  totalCategory,
                  bestSellingProducts,
                  topCategories,
                  profit,
                  totalOrders,
                  totalUsers
            })


      } catch (error) {
            console.log(error);

      }
}

//////adminproduct////////////////
const adminproduct = async (req, res) => {
      try {
            const page = req.query.page ;
            const pageSize = 6;
            const pdtskip = (page-1) * pageSize
            const pdctCount = await product.find({}).count()
            const numofPage = Math.ceil( pdctCount/ pageSize)
            const Product = await product.find({}).skip(pdtskip).limit(pageSize)

            res.render('admin/adminproduct', { Product , numofPage});

      } catch (error) {
            console.log(error);

      }
}

////////////loading admin user list//////////

const adminUser = async (req, res) => {
      try {
            const page = req.query.page ;
            const pageSize = 4;
            const pdtskip = (page-1) * pageSize
            const UserCount = await User.find({}).count()
            const numofPage = Math.ceil(UserCount / pageSize)
            const userData = await User.find({}).skip(pdtskip).limit(pageSize);
            res.render('admin/adminUser', { userData, numofPage })

      } catch (error) {
            console.log(error);

      }
}
////////////////////

const blockuser = async (req, res) => {
      try {
            console.log("blockil und hmmmm");
            const id = req.body.id;
            const findUser = await User.findById({ _id: id });

            if (findUser.is_blocked == false) {
                  const userData = await User.updateOne({ _id: id }, { is_blocked: true })
            }
           res.json({status:"Blocked"});
      } catch (error) {
            console.log("There was an error in blocking user", error);

      }
}

const unblockUser = async (req, res) => {
      try {
            console.log("unnnnnnblockil und hmmmm");
            const id = req.body.id;
            const findUser = await User.findById({ _id: id });

            if (findUser.is_blocked == true) {
                  const userData = await User.updateOne({ _id: id }, { is_blocked: false })
            }
            res.json({status:"Unblocked"})

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

const orderList = async (req, res) => {
      try {
            const page = req.query.page ;
            const pageSize = 8;
            const pdtskip = (page-1) * pageSize
            const odCount = await Order.find({}).count()
            const numofPage = Math.ceil(odCount / pageSize)

            const order = await Order.find({}).skip(pdtskip).limit(pageSize)
            res.render('admin/orderList', { order, numofPage})
            console.log("order", order);
      } catch (error) {
            console.log(error.message);

      }
}

////////Loading OrderDetails Page //////

const orderDetails = async (req, res) => {
      try {
            // console.log("ivdey ndeyyy")
            const id = req.query.id
            const order = await Order.findOne({ _id: id }).populate('products.product')
            const user = await User.findOne({ email: order.user })

            res.render('admin/orderDetails', { order, user })

      } catch (error) {
            console.log(error.message);

      }
}

////////////// Loading Sales REport page /////?////

const salesGet = async (req, res) => {
      try {
            const page = req.query.page 
            const pageSize = 2
            const pdtskip = (page - 1) * pageSize
            const odCount = await Order.find({ status: 'Delivered' }).count()
            const numofPage = Math.ceil(odCount / pageSize)
            const orderData = await Order.find({ status: "Delivered" }).populate('user').sort({ _id: -1 }).skip(pdtskip).limit(pageSize);

            let orderCount = orderData.length
            let totalAmount = 0;
            orderData.forEach(order => {
                  totalAmount += order.totalamount
            })

            res.render('admin/salesReport', { orderData, orderCount, totalAmount, numofPage });
      } catch (error) {
            console.log(error);
      }
}

const filterSalesReportbyDate = async (req, res) => {
      try {
            const { startDate, endDate } = req.body
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
            const filterData = await Order.find({
                  status: "Delivered",
                  date: { $gte: rotatedDate, $lte: rotatedDate2 }
            })
            console.log(filterData)
            res.json({ orders: filterData })

      } catch (err) {
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

            res.json({ orders: filterData ,heading:selectOption});
      } catch (err) {
            console.error("Error in filteringDateRange: ", err.message);
            res.status(500).send({ error: err.message });
      }
};


/////////// Load admin offer add page ///////

const offerGet = async (req, res) => {
      try {
            const Category = await category.find({ is_blocked: false });
            const Offer = await offer.find({}).populate('category', 'name');

            res.render('admin/addOffer', { Category, Offer });
      } catch (error) {
            console.log(error);
      }
}
/////// post offer Data ////////

const offerPost = async (req, res) => {
      try {

            const { Category, startingDate, endingDate, discount } = req.body;
            const findCategory = await category.findOne({ name: Category, });
            const existingOfferCateory = await offer.findOne({ category: findCategory._id });
            if (existingOfferCateory) {

                  res.json({ status: "exist" })
            } else {
                  const newCategoryOffer = new offer({
                        category: findCategory._id,
                        startingDate: startingDate,
                        endingDate: endingDate,
                        percentage: discount
                  })
                  console.log("offer created", newCategoryOffer);
                  await newCategoryOffer.save();
                  res.json({ status: "created" });
            }

      } catch (error) {
            console.log(error);

      }
}

//////////////////////// Deleting offer ///////////

const deleteOffer = async (req, res) => {
      try {
            console.log("delete offerinte ullil nd tto");
            const { id } = req.body;
            const Offer = await offer.findOneAndDelete({ _id: id });
            console.log("yes it deleted");
            res.json({ status: "deleted" });
      } catch (error) {
            console.log(error);
      }
}

////////// monthly Data //////////

const monthlyData = async (req, res) => {
      try {
            console.log("ivde und hmmm");
            const monthlySales = Array.from({ length: 12 }, () => 0);
            const orders = await Order.find({ status: "Delivered" });

            for (const order of orders) {
                  if (order.createdAt instanceof Date) {
                        const month = order.createdAt.getMonth();
                        monthlySales[month] += order.totalamount;
                  } else {
                        console.warn(`Invalid createdAt date for order ${order._id}`);
                  }
            }
            console.log("monthly sales", monthlySales);
            res.json({ monthlySales });
      } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
      }

}
const displayYearlyData = async (req, res) => {
      try {
            console.log('......sldfhgiudarhiupyg....');
            const START_YEAR = 2013;
            const currentYear = new Date().getFullYear();
            const yearlySales = Array.from({ length: currentYear - START_YEAR + 1 }, () => 0);

            const orders = await Order.find({ status: "Delivered" });

            for (const order of orders) {

                  if (order.createdAt instanceof Date) {
                        const year = order.createdAt.getFullYear();
                        yearlySales[year - START_YEAR] += order.totalamount;
                  } else {
                        console.warn(`Invalid createdAt date for order ${order._id}`);
                  }
            }

            res.json({ yearlySales, START_YEAR });
      } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
      }
};




module.exports = {
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
      filteringDateRange,
      offerGet,
      offerPost,
      deleteOffer,
      monthlyData,
      displayYearlyData

}