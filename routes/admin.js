const express = require('express');
const router = express();
const adminController  = require("../controller/adminController");
const categoryController = require("../controller/CategoryController");


router.get('/',adminController.adminLogin)
router.post('/',adminController.verifyAdmin);
router.get('/adminDashboard',adminController.adminDashboard);
router.get('/adminproduct',adminController.adminproduct);
router.get('/adminUser',adminController.adminUser);
router.get('/block-user',adminController.blockuser);
router.get('/unblock-user',adminController.unblockUser);

///////////////category///////////////////
router.get('/adminCategory',categoryController.adminCategory);
router.post('/adminCategory',categoryController.addCategory);
router.get('/cat-edit',categoryController.loadEdit);
router.post('/editCategoryPost',categoryController.editcat);


module.exports=router