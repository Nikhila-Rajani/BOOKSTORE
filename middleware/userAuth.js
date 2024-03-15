const { trusted } = require('mongoose');
const User = require('../model/userModel');

const isLogin = async (req, res, next)=>{
      try {
            if(req.session.email){
                  res.redirect('/')
            }else {
                  next();
            }

      } catch (error) {
            console.log(error.message);
      }
}

const isLogOut = async (req,res,next)=>{
      try {
            if(req,res,next){
                  res.redirect('/')
            }else{
                 next()
            }
            
      } catch (error) {
            console.log(error.message);
            
      }
}

const isBlocked = async (req,res,next) => {
      try {
            if(req.session.email){
                  const findUser = await User.findOne({email : req.session.email});

                  if(findUser){
                        if(findUser?.is_blocked == true){
                              console.log("isBlocked");
                              res.render('user/login')
                        }else {
                              next()
                        }
                  }
            }else{
                  next();
            }
            
      } catch (error) {
            console.log(error.message);
            
      }
}

module.exports = {
      isBlocked,
      isLogin,
      isLogOut
}