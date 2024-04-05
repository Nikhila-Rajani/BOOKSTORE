const User = require('../model/userModel')
const nodemailer = require('nodemailer');
const generateOTP = require('../controller/otpGenerate');
const bcrypt = require('bcrypt');
const Product = require('../model/ProductModel');
const Address = require('../model/addressModel');
const Cart = require('../model/cartModel');

const Email = process.env.Email;
const Password = process.env.Password;

const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
            user: Email,
            pass: Password,
      }
})




//////////////////////////////Password hashing///////////////////////////////////////////////

const passwordHashing = async (password) => {
      try {
            const securePassword = await bcrypt.hash(password, 10);
            return securePassword;

      } catch (error) {
            console.log(error);
      }
}

const userLogin = async (req, res) => {
      try {
            res.render("user/login")

      } catch (error) {
            console.log(error);
      }
}

const userHome = async (req, res) => {
      try {
            const ProductData = await Product.find({ is_blocked: false })
            const email = req.session.email
            res.render("user/home", { ProductData, email })

      } catch (error) {
            console.log(error);
      }
}
const userRegister = async (req, res) => {
      try {
            res.render("user/register")
      } catch (error) {
            console.log(error);
      }
}

////////////////////////////registration data////////////////////////////////////////////


const getUser = async (req, res) => {
      try {

            const { username, email, mobile, password, conpassword } = req.body

            const existingUser = await User.findOne({email:email})
            if(existingUser){
                res.render('user/register',{message:'user is exist'})  
                console.log('existing user');  
            }else{

            
            const otp = generateOTP();
            console.log("otp is :", otp);


            const newUser = {
                  username,
                  email,
                  mobile,
                  password,
                  conpassword,
                  otp

            }

            req.session.Data = req.session.Data || {};


            Object.assign(req.session.Data, newUser)
            req.session.save();

            const mailoptions = {
                  from: Email,
                  to: email,
                  subject: "Your otp verification",
                  text: `your otp ${otp}`,
            }
            transport.sendMail(mailoptions, (err) => {
                  if (err) {
                        console.log(err.message);
                  } else {
                        console.log("Mail send successfully");
                  }
            })

            console.log("User added successfully");
            res.redirect("/otp")

      }

      } catch (error) {
            console.log(error);

      }

};


/////////////////////////////////////// GET OTP /////////////////////////////

const getOtp = async (req, res) => {
      try {
            res.render('user/otp')

      } catch (error) {
            console.log(error);
      }
}
const verifyotp = async (req, res) => {
      try {
           
            if (req.session.Data.otp == req.body.otp) {
                  console.log('stored otp :', req.session.Data.otp)
                  console.log('from body', req.body.otp);
                  const securePass = await passwordHashing(req.session.Data.password)
                  const newUser = new User({
                        username: req.session.Data.username,
                        email: req.session.Data.email,
                        mobile: req.session.Data.mobile,
                        password: securePass

                  })
                  await newUser.save()
                  res.redirect('/login');
            } else {
                  res.json({ err: "otp error" })
            }

      } catch (error) {
            console.log(error);
      }
}
///////////////////////////////////////////////////////////verifying user from login /////////////////////
const verifyLogin = async (req, res) => {
      try {
            const { email, password } = req.body
            const findUser = await User.findOne({ email: email });
            console.log('found',findUser)
            if (findUser) {
                  const passwordMatch = await bcrypt.compare(password,findUser.password)
                  console.log('password',passwordMatch);
                  if(passwordMatch){
                        if (findUser.is_blocked) {
                              console.log('user has been blocked')
                          } else {
                              req.session.user = findUser
                              req.session.email = email
                            
                              res.redirect('/');
                        }
                  }else{
                        console.log('password not watch')
                        res.render('user/login', { passErr: "Incorrect password try again" });
                  }
                
            } else {

                  res.render('user/login', { emailErr: "Incorrect email  please try again " });
            }

      } catch (error) {
            console.log(error);

      }
}
/////load detailed product////
const detailedProduct = async (req, res) => {
      try {
            const id = req.query.id
            const user = req.session.user
           const cartFind = await Cart.findOne({user:user,"products.productId":id})
            const proData = await Product.findById({ _id: id })

            let cartStatus
            if(cartFind){
              cartStatus=true;
            }else{
              cartStatus=false;
            }
           
            res.render("user/detailedProduct", { proData ,cartStatus});

      } catch (error) {
            console.log(error);

      }
}

/////logout user///////

const logoutUser = async (req, res) => {
      try {
            if (req.session.email) {
                  delete req.session.email
                  res.redirect('/login')
            } else {

            }

      } catch (err) {
            console.log(err.message);
      }
}

///////////loading UserProfile/////////////

const userProfile = async (req, res) => {
      try {


            const findUser = await User.findOne({ email: req.session.email })
            console.log(findUser)
            res.render('user/userProfile', { findUser })



      } catch (error) {
            console.log(error);

      }
}

////////loading address page///////

const getAddress = async (req, res) => {
      try {
            const findUser = await User.findOne({ email: req.session.email });
            const findAddress = await Address.find({ user: findUser._id })
           
            res.render('user/userAddress', { findUser, findAddress });

      } catch (error) {
            console.log(error);

      }
}

/////loading Address details /////

const addAddress = async (req, res) => {
      try {
            res.render('user/adduserAddress')

      } catch (error) {
            console.log(error);

      }
}

////////adding Address/////

const postAddress = async (req, res) => {
      try {
            const { name, mobile, pincode, locality, address, city, state, country, addresstype } = req.body

            const findUser = await User.findOne({ email: req.session.email });


            const newAddress = new Address({
                  user: findUser._id,
                  name: name,
                  mobile: mobile,
                  address: address,
                  pin: pincode,
                  location: locality,
                  city: city,
                  state: state,
                  country: country,
                  addresstype: addresstype



            })

            await newAddress.save();
            res.redirect('/userAddress')





      } catch (error) {
            console.log(error);

      }
}

//////////Loading edit Address page //////////////

const editAddress = async (req, res) => {
      try {
            const id = req.query.id;

            const findAddress = await Address.findOne({ _id: id });
            console.log(findAddress);

            res.render("user/editAddress", { findAddress })

      } catch (error) {
            console.log(error);

      }
}

///////////edit address///////////////

const postedit = async (req, res) => {
      try {
            const id = req.query.id;
            console.log(id);
            const { name, mobile, pincode, locality, address, city, state, country, addresstype } = req.body
           
            const updateAddress = await Address.findByIdAndUpdate({ _id: id }, {
                  $set: {
                        name: name,
                        mobile: mobile,
                        address: address,
                        pin: pincode,
                        location: locality,
                        city: city,
                        state: state,
                        country: country,
                        addresstype: addresstype

                  }

            })
            res.redirect('/userAddress')



      } catch (error) {
            console.log(error);
      }
}

////////////////////////////////delete Address////////////

const deleteAddress = async (req, res) => {
      try {
            const id = req.query.id;
            console.log(id);
            const Delete = await Address.findByIdAndDelete({ _id: id })
            res.redirect('/userAddress')

      } catch (error) {
            console.log(error);

      }
}

//////////////Loading change Password page//////////////

const changePassword = async (req, res) => {
      try {

            res.render('user/changePassword')


      } catch (error) {
            console.log(error);

      }
}

////////////Changing Password///////////////

const postPassword = async (req, res) => {
      try {

            const { current, newPassword, conPassword } = req.body
            const findUser = await User.findOne({ email: req.session.email })
            const passWordCompare = findUser.password
            const passwordMatch = await bcrypt.compare(current, passWordCompare)
            // console.log('hashed', passwordMatch)


            if (passwordMatch) {

                  if (newPassword === conPassword) {
                        const passwordHash = await bcrypt.hash(newPassword, 10)
                        const updatePass = await User.findOneAndUpdate(
                              { _id: findUser },
                              {
                                    $set: {
                                          password: passwordHash
                                    },
                              }
                        );
                        console.log('updated==>>', updatePass);
                        res.json({ status: true })

                  } else {
                        console.log("Both passwords do not match");
                        res.json({ status: "InvalidPassword" })
                  }




            } else {
                  console.log('password deos not compare');
                  res.json({ status: "compare" })
            }


      } catch (error) {
            console.log(error);

      }
}

////////Loading  Account page /////////

const userAccount = async (req, res) => {
      try {
            const findUser = await User.findOne({ email: req.session.email })
            console.log(findUser);
            res.render('user/userAccount', { findUser })

      } catch (error) {
            console.log(error);
      }

}

//////////Account details editing////

const userAccountedit =async (req,res) => {
      try {
       const  userId = req.query._id
       const findUser = await User.findOne({_id:userId})
    
      res.render('user/useraccountEdit',{findUser})

            
      } catch (error) {
            console.log(error);
            
      }
}

console.log('heloo'+ 1)
///////////Saving edited data bu accepting from body//////

const editPost = async (req,res) =>{
      try {
            const {name,email,mobile}= req.body
            const userData = req.session.email;
            if(userData){
                  const updateData = await User.findOneAndUpdate({email:userData},{$set:{
                        username:name,
                        email:email,
                        mobile:mobile
      
                  }})
                  console.log('updated===>>>',updateData);
                  await updateData.save()
                  res.json({status:'updated'})
            }else{
                  console.log('cannot find')
            }
          
            
      } catch (error) {
            console.log(error);
            
      }
}

/////////// Search product///////

const searchProduct = async (req,res) => {
      try{
            console.log("ivde ndeyy");
            const {searchDataValue} = req.body
            console.log(req.body);
            const searchProducts = await Product.find({name:{
                $regex: searchDataValue , $options: 'i'
            }})
            console.log(searchProducts);
            res.json({status:"searched",searchProducts})
    
        }catch(error){
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
      postPassword,
      userAccount,
      userAccountedit,
      editPost,
      searchProduct
}






