const express = require('express');
const router = express();
const adminController  = require("../controller/adminController");
const categoryController = require("../controller/CategoryController");
const productController = require("../controller/productController");
const upload = require('../multer/multer');
const middleware = require('../middleware/adminAuth')



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
router.post('/editCategoryPost',categoryController.editcat)
router.post('/block-unblock',categoryController.blockunblock);

/////////////Product////////////////////////////////////

router.get('/addProduct',productController.loadAddpro);
router.post('/addProduct',upload.array('image'),productController.addProduct);
router.get('/productUnblock',productController.productUnblock)
router.get('/productBlock',productController.productBlock);
router.get('/editProduct',productController.editProduct);
router.post('/editProduct',upload.array('image'),productController.editPro)
router.post('/deleteimage',productController.deleteImage)




module.exports=router