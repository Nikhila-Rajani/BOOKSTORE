const express = require('express');
const router = express();
const userController = require('../controller/userController')
const middleware = require('../middleware/userAuth')


router.get('/',middleware.isBlocked,userController.userHome);
router.get('/login',middleware.isLogin,userController.userLogin);
router.post('/login',userController.verifyLogin)
router.get('/register',userController.userRegister);
router.post('/register',userController.getUser);
router.get('/otp',middleware.isLogin,userController.getOtp);
router.post('/otp',userController.verifyotp);
router.get('/logout',userController.logoutUser)

router.get('/detailedProduct',middleware.isBlocked,userController.detailedProduct)





module.exports = router;









