const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const generateOTP = require('../controller/otpGenerate');
const bcrypt = require('bcrypt');
const Product = require('../model/ProductModel');
const Address = require('../model/addressModel');

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

////////////////////////////registration data////////////////////////////////////////////


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
                        req.session.save()
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

 ///////////loading UserProfile/////////////

 const userProfile = async(req,res)=>{
      try {
            
            
            const findUser = await User.findOne({email:req.session.email})
            console.log(findUser)
            res.render('user/userProfile',{findUser})
            
           
            
      } catch (error) {
            console.log(error);
            
      }
 }

 ////////loading address page///////

 const getAddress = async(req,res)=>{
      try {
            const findUser = await User.findOne({email:req.session.email});
            const findAddress = await Address.find({user:findUser._id})
            console.log(findAddress);

            res.render('user/userAddress',{findUser,findAddress});
            
      } catch (error) {
            console.log(error);
            
      }
 }

 /////loading Address details /////

 const addAddress = async(req,res)=>{
      try {
            res.render('user/adduserAddress')
            
      } catch (error) {
            console.log(error);
            
      }
 }

 ////////adding Address/////

 const postAddress = async(req,res)=>{
      try {
            const {name,mobile,pincode,locality,address,city,state,country,addresstype} = req.body
            
            const findUser = await User.findOne({email:req.session.email});
           

            const newAddress = new Address({
                  user:findUser._id,
                  name : name,
                  mobile : mobile,
                  address : address,
                  pin : pincode,
                  location :locality,
                  city : city,
                  state : state,
                  country :country,
                  addresstype : addresstype

                  

            })
            
            await newAddress.save();
            res.redirect('/userAddress')




            
      } catch (error) {
            console.log(error);
            
      }
 }

 //////////Loading edit Address page //////////////

 const editAddress = async (req,res)=>{
      try {
           const id = req.query.id;
      //      console.log(id);
      const findAddress = await Address.findOne({_id:id});
      console.log(findAddress);

            res.render("user/editAddress",{findAddress})
            
      } catch (error) {
            console.log(error);
            
      }
 }

 ///////////edit address///////////////

 const postedit = async (req,res)=>{
      try {
            const id = req.query.id;
            console.log(id);
            const {name,mobile,pincode,locality,address,city,state,country,addresstype} = req.body
            console.log(name,mobile,pincode,locality,address,city,state,country,addresstype);
            const updateAddress = await Address.findByIdAndUpdate({_id:id},{
                  $set:{
                        name : name,
                        mobile : mobile,
                        address : address,
                        pin : pincode,
                        location :locality,
                        city : city,
                        state : state,
                        country :country,
                        addresstype : addresstype

                  }

            })
            res.redirect('/userAddress')


            
      } catch (error) {
            console.log(error);
      }
 }

 ////////////////////////////////delete Address////////////

 const deleteAddress = async(req,res)=>{
      try {
            const id = req.query.id;
            console.log(id);
            const Delete = await Address.findByIdAndDelete({_id:id})
            res.redirect('/userAddress')
            
      } catch (error) {
            console.log(error);
            
      }
 }

 //////////////Loading change Password page//////////////

 const changePassword = async(req,res)=>{
     try {

      res.render('user/changePassword')

      
     } catch (error) {
      console.log(error);
      
     }
 }

 ////////////Changing Password///////////////

 const postPassword = async (req,res)=>{
      try {
            const {current,New,confirm} = req.body
            // console.log(current,New,confirm);
            const findUser = await User.findOne({email:req.session.email})
            // console.log(findUser);
            const passwordMatch = await bcrypt.compare(current,findUser.Password)

            
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
      verifyLogin,
      detailedProduct,
      logoutUser,
      userProfile,
      getAddress,
      addAddress,
      postAddress,
      editAddress,
      postedit,
      deleteAddress,
      changePassword,
      postPassword
}






