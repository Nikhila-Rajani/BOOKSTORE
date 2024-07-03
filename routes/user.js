const express = require('express');
const router = express();
const passport = require('passport')
const userController = require('../controller/userController');
const middleware = require('../middleware/userAuth');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderControlller');
const productController = require('../controller/productController');
const WishListController = require('../controller/wishListController');
const walletController = require('../controller/walletController');
const couponController = require('../controller/couponController');



router.get('/',middleware.isBlocked,userController.userHome);
router.get('/login',middleware.isLogOut,userController.userLogin);
router.post('/login',middleware.isLogOut,userController.verifyLogin)
router.get('/register',middleware.isLogOut,userController.userRegister);
router.post('/register',userController.getUser);
router.get('/otp',middleware.isLogOut,userController.getOtp);
router.post('/otp',userController.verifyotp);
router.get('/logout',userController.logoutUser)
router.get("/resendOtp",userController.resendOtp)
// Google login
router.get('/login/google', middleware.isLogOut, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google',{ failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user
        req.session.email = req.user.email
        res.redirect('/');
    });

router.get('/detailedProduct',middleware.isBlocked,userController.detailedProduct)
router.get('/userProfile',middleware.isLogin,userController.userProfile);
router.get('/userAddress',middleware.isLogin,userController.getAddress);
router.get('/adduserAddress',middleware.isLogin,userController.addAddress);
router.post('/adduserAddress',middleware.isLogin,userController.postAddress);
router.get('/editAddress',middleware.isLogin,userController.editAddress);
router.post('/editAddress',middleware.isLogin,userController.postedit);
router.get('/deleteAddress',middleware.isLogin,userController.deleteAddress);
router.get('/changePassword',middleware.isLogin,userController.changePassword);
router.post('/changePassword',middleware.isLogin,userController.postPassword);
router.get('/userAccount',middleware.isLogin,userController.userAccount);
router.get('/userAccount-edit',middleware.isLogin,userController.userAccountedit);
router.post('/userAccount-edit',middleware.isLogin,userController.editPost);

router.get('/cart',middleware.isLogin,cartController.userCart)
router.post('/cart',middleware.isLogin,cartController.addtoCart);
router.post('/increment',middleware.isLogin,cartController.increment);
router.post('/decrement',middleware.isLogin,cartController.decrement);
router.delete('/deletecart',middleware.isLogin,cartController.deletecart);
router.get('/checkoutpage',middleware.isLogin,cartController.checkOut);

router.post('/placeOrder',middleware.isLogin,orderController.placeOrder);
router.get('/ordersuccess',middleware.isLogin,orderController.orderSuccess);
router.get('/orderDetails',middleware.isLogin,orderController.orderDetails)
router.get('/viewOrder',middleware.isLogin,orderController.viewOrder);
router.post('/payAgain',middleware.isLogin,orderController.payAgain);
router.post('/paymentsucces',middleware.isLogin,orderController.pendingPaymentSuccess)

router.post('/search',userController.searchProduct)

router.get('/sort',userController.sortItems)
router.get('/filter',userController.filterCategory);
router.post('/cancelOrder',middleware.isLogin,orderController.userCancelOrder);
router.post('/cancelIndividual',middleware.isLogin,orderController.cancelIndividual);
router.post('/razorsuccess',middleware.isLogin,orderController.razorpaySuccess);
router.post('/returnOrder',middleware.isLogin,orderController.returnOrder);
router.get('/invoice',middleware.isLogin,orderController.getInvoice);
router.post('/razorpayfailed',middleware.isLogin,orderController.razorpayfailed);



router.get('/Wishlist',middleware.isLogin,WishListController.LoadWishlist);
router.post('/Wishlist',middleware.isLogin,WishListController.addtoWishlist);
router.post('/deleteWishlist',middleware.isLogin,WishListController.deleteWishlist);
router.post('/cart',middleware.isLogin,cartController.addtoCart);


router.get('/userWallet',middleware.isLogin,walletController.LoadWallet);

router.get('/userCoupon',middleware.isLogin,couponController.userCouponGet);
router.post('/ApplyCoupon',middleware.isLogin,couponController.userApplyCoupon)












module.exports = router;




   




