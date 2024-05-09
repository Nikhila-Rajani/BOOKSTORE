const express = require('express');
const router = express();
const adminController = require("../controller/adminController");
const categoryController = require("../controller/CategoryController");
const productController = require("../controller/productController");
const orderController = require('../controller/orderControlller')
const upload = require('../multer/multer');
const middleware = require('../middleware/adminAuth');
const couponController = require('../controller/couponController');



router.get('/', adminController.adminLogin)
router.post('/', adminController.verifyAdmin);
router.get('/adminDashboard', middleware.isAdmin, adminController.adminDashboard);
router.get('/adminproduct', middleware.isAdmin, adminController.adminproduct);
router.get('/adminUser', middleware.isAdmin, adminController.adminUser);
router.get('/block-user', middleware.isAdmin,adminController.blockuser);
router.get('/unblock-user', middleware.isAdmin,adminController.unblockUser);
// router.get('/unblock-user', middleware.isAdmin, adminController.toggleuser);

///////////////category///////////////////
router.get('/adminCategory', middleware.isAdmin, categoryController.adminCategory);
router.post('/adminCategory', middleware.isAdmin, categoryController.addCategory);
router.get('/cat-edit', middleware.isAdmin, categoryController.loadEdit);
router.post('/editCategoryPost', middleware.isAdmin, categoryController.editcat)
router.post('/block-unblock', middleware.isAdmin, categoryController.blockunblock);

/////////////Product////////////////////////////////////

router.get('/addProduct', middleware.isAdmin, productController.loadAddpro);
router.post('/addProduct', middleware.isAdmin, upload.array('image'), productController.addProduct);
router.get('/productUnblock', middleware.isAdmin, productController.productUnblock)
router.get('/productBlock', middleware.isAdmin, productController.productBlock);
router.get('/editProduct', middleware.isAdmin, productController.editProduct);
router.post('/editProduct', middleware.isAdmin, upload.array('image'), productController.editPro);
router.post('/deleteimage', middleware.isAdmin, productController.deleteImage);

////////Order/////////////

router.get('/orderList', middleware.isAdmin, adminController.orderList)
router.get('/orderDetails', middleware.isAdmin, adminController.orderDetails);
router.post('/changeStatus', middleware.isAdmin, orderController.adminChangeStatus);

//////Coupon////////

router.get('/addCoupon', middleware.isAdmin, couponController.loadAddcoupon);
router.post('/addCoupon',  middleware.isAdmin,couponController.addCouponPost);
router.get('/allCoupon', middleware.isAdmin, couponController.allCouponGet);
router.post('/blockCoupon',  middleware.isAdmin,couponController.blockCoupon);
router.post('/unblockCoupon',  middleware.isAdmin,couponController.unblockCoupon);
router.post('/deleteCoupon',  middleware.isAdmin,couponController.deleteCoupon)

////// Sales Report //////

router.get('/salesReport',  middleware.isAdmin,adminController.salesGet);
router.post('/salesReport',  middleware.isAdmin,adminController.filterSalesReportbyDate);
router.post('/daterangesales',  middleware.isAdmin,adminController.filteringDateRange);

/////////// Offer /////////

router.get('/addOffer',adminController.offerGet);
router.post('/addOffer',adminController.offerPost);
router.post('/deleteOffer',adminController.deleteOffer);

/////////// Chart /////////

router.get('/adminDashboard/monthlydata',adminController.monthlyData)
router.get('/adminDashboard/yearlydata',adminController.displayYearlyData)

module.exports = router