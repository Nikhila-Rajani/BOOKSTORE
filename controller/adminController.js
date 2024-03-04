
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;



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









module.exports ={
      adminLogin,
      verifyAdmin,
      adminDashboard,
}