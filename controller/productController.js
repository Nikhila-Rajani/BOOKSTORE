const Product = require("../model/ProductModel");
const Category = require("../model/CategoryModel")


const loadAddpro = async (req,res) =>{
      try {
            const catData = await Category.find({is_blocked:false})
            res.render('admin/addProduct',{catData});
            
      } catch (error) {
            console.log(error);
            
      }
}

const addProduct = async (req,res) =>{
      try {
            const { product_name, product_des ,regprice, offprice, catName,stock} = req.body
            console.log(product_des);
            const cat = await Category.findOne({_id:catName});
            const imageName = req.files.map((x) => x.originalname);

            const product = new Product({
                  name:product_name,
                  discription:product_des,
                  regularPrice:regprice,
                  offerPrice:offprice,
                  image:imageName,
                  stock:stock,

                  category:cat._id,
                  is_blocked:false

            });
            const proData = await product.save();
            res.redirect('/admin/adminproduct')
            

            
      } catch (error) {
            console.log(error);
            
      }
}
const editProduct = async (req,res) =>{
      try {
            const productData = req.query._id;
            const productDetails = await Product.findOne({_id:productData});
            const categoryData = await Category.find({is_blocked:false})
            res.render('admin/editProduct',{productDetails,categoryData})
            
      } catch (error) {
            console.log(error);
            
      }
}
const productBlock = async (req,res) =>{
      try {
            const productData = req.query._id;
            const data = await Product.findByIdAndUpdate(productData,{ is_blocked:true}) 
            res.redirect("/admin/adminProduct");
      } catch (error) {
            console.log(error);
            
      }
}
const productUnblock = async (req,res) =>{
      try {

            const productData = req.query._id;
            const data = await Product.findByIdAndUpdate(productData,{ is_blocked:false}) 
            res.redirect("/admin/adminProduct");

      } catch (error) {
            console.log(error);
            
      }
}













module.exports = {
      loadAddpro,
      addProduct,
      editProduct,
      productBlock,
      productUnblock
}

