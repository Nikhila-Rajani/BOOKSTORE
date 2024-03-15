const Product = require("../model/ProductModel");
const Category = require("../model/CategoryModel")
const fs = require('fs')


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

// loading edit product page;

const editProduct = async (req,res) =>{
      try {

            const id = req.query._id;
            req.session.productId = id
            const productDetails = await Product.findOne({ _id: id }).populate('category')
            const category = await Category.find({})
          
            res.render('admin/editProduct',{productDetails,category})
            
            
      } catch (error) {
            console.log(error);
            
      }
}

/////editing  product page///////
const editPro = async (req, res) => {
      try {
           
          const productId = req.session.productId
          const {  pname, product_des ,regprice, offprice, catName,stock} = req.body;
              
      
          let imageName = [];
  
 
          if (req.files && req.files.length > 0) {
              imageName = req.files.map((x) => x.originalname);
          } else {
         
              const proData = await Product.findById({_id:productId});
              if (proData && proData.image && proData.image.length > 0) {
                  imageName = proData.image;
              }
          }
  
          const cat = await Category.findOne({name:catName});
  
          const updatePro = await Product.findByIdAndUpdate(
              { _id: productId },
              {
                  $set: {
                        name: pname,
                        discription:product_des,
                        regularPrice:regprice,
                        offerPrice:offprice,
                        image:imageName,
                        stock:stock,
      
                        category:cat._id,
                        is_blocked:false
                  },
              }
          );
             
            
              res.redirect("/admin/adminProduct");

          
      } catch (error) {
          console.log(error.message);
          res.status(500).send("Internal Server Error");
      }
  };

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


const deleteImage = async(req,res)=>{
      try{
           
            const pid = req.body.id
             const index = req.body.index
           const  prodata = await Product.findById(pid)
           const imagedelete = prodata.image[index]
           fs.unlink(imagedelete,(err)=>{
            if(err){
                  console.error();
            }else{
                  console.log('done');
            }
           })
           prodata.image.splice(index)
           await prodata.save()
           res.json({status:"delete"})
            
      }catch(err){
            console.log(err.message)
      }
}















module.exports = {
      loadAddpro,
      addProduct,
      editProduct,
      productBlock,
      productUnblock,
      editPro,
      deleteImage
      
      
}

