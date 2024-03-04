const express = require('express');
const router = express();
const userController = require('../controller/userController')


router.get('/',userController.userHome);
router.get('/login',userController.userLogin);
router.post('/login',userController.verifyLogin)
router.get('/register',userController.userRegister);
router.post('/register',userController.getUser);
router.get('/otp',userController.getOtp);
router.post('/otp',userController.verifyotp);





module.exports = router;









