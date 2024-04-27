const mongoose =require('mongoose');
const Wallet = require('../model/walletModel');
const WishList = require('../model/wishListModel');
const Cart = require('../model/cartModel');

const LoadWallet = async(req,res) =>{
      try {
            res.render('user/userWallet')
            
      } catch (error) {
            console.log(error);
      }
}

module.exports = {
      LoadWallet
}