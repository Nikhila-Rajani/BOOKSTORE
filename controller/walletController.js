const mongoose =require('mongoose');
const Wallet = require('../model/walletModel');
const WishList = require('../model/wishListModel');
const Cart = require('../model/cartModel');

const LoadWallet = async(req,res) =>{
      try {
            const user = req.session.user
           // console.log("the user in the wallet",user);
           const findWallet = await Wallet.findOne({user:user})
           console.log("Wallet kitti mwonee",findWallet);
            res.render('user/userWallet',{findWallet})
       
      } catch (error) {
            console.log(error);
      }
}

module.exports = {
      LoadWallet
}