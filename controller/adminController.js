const User = require('../model/userModel');
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;
const product = require('../model/ProductModel')

//////////admin login///////////////////////////////////////////////

const adminLogin = async (req,res)=>{
      try {
            res.render('admin/adminlogin')
            
      } catch (error) {
            console.log("Error in rendering admin login",error);
      }
}

//////////////verifying admin by using data from body////////////////////////////////////

const verifyAdmin = async (req,res)=>{
      try {
            const email = req.body.email;
            const password = req.body.password;
            if(email==adminEmail && password==adminPassword){
                  res.redirect('/admin/adminDashboard');
            }
            
      } catch (error) {
            console.log("Error in verifying admin",error);
            
      }
}

///////////function for adminDashboard/////////////////////
const adminDashboard = async (req,res)=>{
      try {
            res.render('admin/adminDashboard');
            
      } catch (error) {
            console.log(error);
            
      }
}

//////adminproduct////////////////
const adminproduct = async (req,res)=>{
      try {
            const Product = await product.find({})
            res.render('admin/adminproduct',{Product});
            
      } catch (error) {
            console.log(error);
            
      }
}

////////////loading admin user list//////////

const adminUser= async (req,res)=>{
      try {
            const userData = await User.find({})
            res.render('admin/adminUser',{userData});
            
      } catch (error) {
            console.log(error);
            
      }
}
////////////////////

const blockuser = async (req,res)=>{
      try {
           const id = req.query.id;
           const findUser = await User.findById({_id :id});

           if(findUser.is_blocked == false){
            const userData = await User.updateOne({_id:id},{is_blocked : true})
           }
            res.redirect('/admin/adminUser')
      } catch (error) {
            console.log("There was an error in blocking user",error);
            
      }
}

const unblockUser = async (req,res)=>{
      try {
            const id = req.query.id;
            const findUser = await User.findById({_id:id});
            
           if(findUser.is_blocked == true){
            const userData = await User.updateOne({_id:id},{is_blocked : false})
           } 
           res.redirect('/admin/adminUser')
            
      } catch (error) {
            console.log(error);
            
      }
}






module.exports ={
      adminLogin,
      verifyAdmin,
      adminDashboard,
      adminproduct,
      adminUser,
      blockuser,
      unblockUser,
}