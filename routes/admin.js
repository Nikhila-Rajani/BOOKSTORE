const express = require('express');
const router = express();
const adminController  = require("../controller/adminController");

router.get('/',adminController.adminLogin)
router.post('/',adminController.verifyAdmin);
router.get('/adminDashboard',adminController.adminDashboard);

module.exports=router