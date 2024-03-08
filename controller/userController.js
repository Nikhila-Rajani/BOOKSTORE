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
            res.render("user/home",{ProductData})
            
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
           
            let {username,email,mobile,password,conpassword} = req.body
            username = username.trim();
            email = email.trim();
            mobile = mobile.trim();
            password = password.trim();
            conpassword = conpassword.trim();

            const otp = generateOTP();
            console.log(otp);

           ///////////////////////////////validation///////////////////////////////////

           //checking if fields are empty 
           if(username===""||email===""||mobile===""||password===""||conpassword===""){
            res.render("user/register",{message:"Fields are empty"})
           }else if(password!==conpassword){
            res.render("user/register",{message:"Both passwords do not match"});
           }else if(!/^(?!0{10})[1-9][0-9]{9}$/.test(mobile)){
            res.render("user/register",{message:"Number is invlid!.."})
           }else if (!/^[A-Z][a-zA-Z]*([ ][A-Z][a-zA-Z]*)?$/.test(username)){
            res.render("user/register",{message:"Name is invalid!.."})
           }else if(password.length<8){
            res.render("user/register",{message:"Password should contain minimum 8 characters.. "})
           }else if(!/^(?!.*\s)[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){
            res.render("user/register",{message:"Enter a valid email!"})
           }else{
            const existsEmail  = await User.findOne({email:email});
            const existMobile  = await User.findOne({mobile:mobile});
            if(existsEmail){
                  res.render("user/register",{message:"email already ullathaa molusaaa"})
            }else if(existMobile){
                  res.render("user/register",{message:"Mobile number already exists"})
            }else{
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
                 //// //sending otp through mail
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
            }
           }
           
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
                        res.render('user/home');
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







module.exports = {
      userLogin,
      userHome,
      userRegister,
      getUser,
      getOtp,
      verifyotp,
      verifyLogin
}






