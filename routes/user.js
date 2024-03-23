const express = require('express');
const router = express();
const userController = require('../controller/userController')
const middleware = require('../middleware/userAuth')


router.get('/',middleware.isBlocked,userController.userHome);
router.get('/login',middleware.isLogOut,userController.userLogin);
router.post('/login',middleware.isLogOut,userController.verifyLogin)
router.get('/register',middleware.isLogOut,userController.userRegister);
router.post('/register',userController.getUser);
router.get('/otp',middleware.isLogOut,userController.getOtp);
router.post('/otp',userController.verifyotp);
router.get('/logout',userController.logoutUser)

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






module.exports = router;




   




