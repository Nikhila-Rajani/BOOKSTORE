const express = require('express');
const router = express();
const userController = require('../controller/userController')
const middleware = require('../middleware/userAuth')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderControlller')
const productController = require('../controller/productController')
const WishListController = require('../controller/wishListController')



router.get('/',middleware.isBlocked,userController.userHome);
router.get('/login',middleware.isLogOut,userController.userLogin);
router.post('/login',middleware.isLogOut,userController.verifyLogin)
router.get('/register',middleware.isLogOut,userController.userRegister);
router.post('/register',userController.getUser);
router.get('/otp',middleware.isLogOut,userController.getOtp);
router.post('/otp',userController.verifyotp);
router.get('/logout',userController.logoutUser)
router.get("/resendOtp",userController.resendOtp)

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

router.post('/search',userController.searchProduct)

router.get('/sort',userController.sortItems)
router.get('/filter',userController.filterCategory);
router.post('/cancelOrder',orderController.userCancelOrder);
router.post('/cancelIndividual',orderController.cancelIndividual);


router.get('/Wishlist',WishListController.LoadWishlist);
router.post('/Wishlist',WishListController.addtoWishlist);
router.post('/deleteWishlist',WishListController.deleteWishlist);
router.post('/cart',cartController.addtoCart);











module.exports = router;




   




