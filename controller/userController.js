const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const generateOTP = require('../controller/otpGenerate');
const bcrypt = require('bcrypt');
const Product = require('../model/ProductModel')

const Email = process.env.Email;
const Password = process.env.Password;

const transport = nodemailer.createTransport({
      host:"smtp.gmail.com",
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
            user:Email,
            pass:Password,
      }
})


 

//////////////////////////////Password hashing///////////////////////////////////////////////

const passwordHashing = async (password)=> {
      try {
            const securePassword = await bcrypt.hash(password,10);
            return securePassword;
            
      } catch (error) {
            console.log(error);    
      }
}

const userLogin = async(req,res)=>{
      try {
            res.render("user/login")
            
      } catch (error) {
            console.log(error);
      }
}

const userHome = async(req,res)=>{
      try {
            const ProductData =await Product.find({is_blocked:false})
           const email = req.session.email
            res.render("user/home",{ProductData,email})
            
      } catch (error) {
            console.log(error);
      }
}
const userRegister = async(req,res)=>{
      try{
            res.render("user/register")
      }catch(error){
            console.log(error);
      }
}

///////////////////////////registration data///////////////////////////////////////////////////

const getUser = async(req,res)=>{
      try {
         
            const {username,email,mobile,password,conpassword} = req.body
          

            const otp = generateOTP();
            console.log("otp is :",otp);

        
                  const newUser = {
                        username,
                        email,
                        mobile,
                        password,
                        conpassword,
                        otp

                  }
                  
                  req.session.Data =  req.session.Data || {};
                
                  
                  Object.assign(req.session.Data,newUser)
                  req.session.save();
               
                  const mailoptions = {
                        from:Email,
                        to:email,
                        subject:"Your otp verification",
                        text:`your otp ${otp}`,
                  }
                transport.sendMail(mailoptions,(err)=>{
                  if(err){
                        console.log(err.message);
                  }else{
                        console.log("Mail send successfully");
                  }
                })

                console.log("User added successfully");
                res.redirect("/otp")
            
           
           
      } catch (error) {
            console.log(error);
            
      }

};
///////////////////////////////////////GET OTP /////////////////////////////

const getOtp = async(req,res)=>{
      try {
            res.render('user/otp')
            
      } catch (error) {
            console.log(error);
      }
}
const verifyotp = async(req,res)=>{
      try {
            console.log(req.body);
            if(req.session.Data.otp==req.body.otp){
                  console.log('stored otp :',req.session.Data.otp)
                  console.log('from body',req.body.otp);
                  const securePass = await passwordHashing(req.session.Data.password)
                  const newUser = new User({
                        username:req.session.Data.username,
                        email:req.session.Data.email,
                        mobile:req.session.Data.mobile,
                        password:securePass

                  })
            await newUser.save()
            res.redirect('/login');
            }else{
                  res.json({ err:"otp error"})
            }
            
      } catch (error) {
            console.log(error);
      }
}
///////////////////////////////////////////////////////////verifying user from login /////////////////////
const verifyLogin = async(req,res)=>{
      try {
            const {email,password}=req.body
            const findUser = await User.findOne({email:email});
            if(findUser){
                  const passwordMatch = await bcrypt.compare(password,findUser.password)
                  if(passwordMatch){
                        req.session.email =  email
                        res.redirect('/');
                  }else{
                        res.render('user/login',{passErr:"Incorrect password try again"});
                  } 
            }else{
                 
                  res.render('user/login',{emailErr:"Incorrect email  please try again "});
            }
            
      } catch (error) {
            console.log(error);
            
      }
}
/////load detailed product////
const detailedProduct = async (req,res) =>{
      try {
            const id = req.query.id
            console.log(id);
             const proData = await Product.findById({_id : id})
             console.log(proData);
            res.render("user/detailedProduct",{proData});
            
      } catch (error) {
            console.log(error);
            
      }
 }



 const logoutUser = async(req,res)=>{
      try{
            if(req.session.email){
                  delete req.session.email 
                  res.redirect('/login')
            }else{

            }

      }catch(err){
            console.log(err.message);
      }
 }





module.exports = {
      userLogin,
      userHome,
      userRegister,
      getUser,
      getOtp,
      verifyotp,
      verifyLogin,
      detailedProduct,
      logoutUser
}






