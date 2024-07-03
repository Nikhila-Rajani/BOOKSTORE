const Product = require("../model/ProductModel");
const Category = require("../model/CategoryModel")
const fs = require('fs');
const sharp = require("sharp");
const path = require('path');


const loadAddpro = async (req, res) => {
      try {
            const catData = await Category.find({ is_blocked: false }) 
            res.render('admin/addProduct', { catData });

      } catch (error) {
            console.log(error);

      }
}
const addProduct = async (req, res) => {
      try {
          const { product_name, product_des, regprice, offprice, catName, stock , cropvaluesimg1 ,cropvaluesimg2 , cropvaluesimg3 , cropvaluesimg4} = req.body;
  
         
          const cat = await Category.findOne({ _id: catName });
          if (!req.files || req.files.length === 0) {
              return res.status(400).send('No files uploaded');
          }
          const cropped1 = cropvaluesimg1 ? JSON.parse(cropvaluesimg1) : null;
          const cropped2 = cropvaluesimg2 ? JSON.parse(cropvaluesimg2) : null;
          const cropped3 = cropvaluesimg3 ? JSON.parse(cropvaluesimg3) : null;
          const cropped4 = cropvaluesimg4 ? JSON.parse(cropvaluesimg4) : null;

          let cropvalues = [cropped1,cropped2,cropped3,cropped4]
          const croppedImages = [];
          let i = 0;
          for (const file of req.files) {
              try {
                  const x = cropvalues[i]?.x ? Math.floor(cropvalues[i]?.x) : 500;
                  const y = cropvalues[i]?.y ? Math.floor(cropvalues[i]?.y) : 700;
                  const width = cropvalues[i]?.width ? Math.floor(cropvalues[i]?.width) : 500;
                  const height = cropvalues[i]?.height ? Math.floor(cropvalues[i]?.height) : 700;
                  const originalPath = file.path;
                  const outputFileName = `cropped_${Date.now()}.jpeg`;
                  const outputPath = `public/uploads/${outputFileName}`;
                  await sharp(originalPath).extract({ left: x, top: y, width: width, height: height }).resize(width, height).toFile(outputPath);
  
                  croppedImages.push(outputFileName);
                  i++;
              } catch (error) {
                  console.error('Error processing image:', error);
              }
          }
  
          // Create new product
          const product = new Product({
              name: product_name,
              discription: product_des,
              regularPrice: regprice,
              offerPrice: offprice,
              image: croppedImages,
              stock: stock,
              category: cat._id,
              is_blocked: false
          });
  
          const proData = await product.save();
          res.redirect('/admin/adminproduct');
      } catch (error) {
          console.error('Error adding product:', error);
      }
  };
  
  
// loading edit product page;

const editProduct = async (req, res) => {
      try {

            const id = req.query._id;
            req.session.productId = id
            const productDetails = await Product.findOne({ _id: id }).populate('category')
            const category = await Category.find({})
            //console.log("productDetails",productDetails);

            res.render('admin/editProduct', { productDetails, category })


      } catch (error) {
            console.log(error);

      }
}

/////editing  product page///////
const editPro = async (req, res) => {
      try {

            const productId = req.session.productId
            const { pname, product_des, regprice, offprice, catName, stock, cropvaluesimg1 ,cropvaluesimg2 , cropvaluesimg3 , cropvaluesimg4 } = req.body;

            const images = req.files
            const imageFile = await images.map(image => image.filename)

            if (images.length > 0) {
                  await Product.findByIdAndUpdate({ _id: productId }, { $push: { image: { $each: imageFile } } })
            }

            


            const cat = await Category.findOne({ name: catName });

            
            if (!req.files || req.files.length === 0) {
                return res.status(400).send('No files uploaded');
            }
            const cropped1 = cropvaluesimg1 ? JSON.parse(cropvaluesimg1) : null;
            const cropped2 = cropvaluesimg2 ? JSON.parse(cropvaluesimg2) : null;
            const cropped3 = cropvaluesimg3 ? JSON.parse(cropvaluesimg3) : null;
            const cropped4 = cropvaluesimg4 ? JSON.parse(cropvaluesimg4) : null;
  
            let cropvalues = [cropped1,cropped2,cropped3,cropped4]
            const croppedImages = [];
            let i = 0;
            for (const file of req.files) {
                try {
                    const x = cropvalues[i]?.x ? Math.floor(cropvalues[i]?.x) : 500;
                    const y = cropvalues[i]?.y ? Math.floor(cropvalues[i]?.y) : 700;
                    const width = cropvalues[i]?.width ? Math.floor(cropvalues[i]?.width) : 500;
                    const height = cropvalues[i]?.height ? Math.floor(cropvalues[i]?.height) : 700;
                    const originalPath = file.path;
                    const outputFileName = `cropped_${Date.now()}.jpeg`;
                    const outputPath = `public/uploads/${outputFileName}`;
                    await sharp(originalPath).extract({ left: x, top: y, width: width, height: height }).resize(width, height).toFile(outputPath);
    
                    croppedImages.push(outputFileName);
                    i++;
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            }

            const updatePro = await Product.findByIdAndUpdate(
                  { _id: productId },
                  {
                        $set: {
                              name: pname,
                              discription: product_des,
                              regularPrice: regprice,
                              offerPrice: offprice,
                              stock: stock,

                              category: cat._id,
                              is_blocked: false
                        },
                  }
            );


            res.redirect("/admin/adminProduct");


      } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
      }
};

const productBlock = async (req, res) => {
      try {
            const productData = req.query._id;

            const data = await Product.findByIdAndUpdate(productData, { is_blocked: true })
            res.redirect("/admin/adminProduct");

      } catch (error) {
            console.log(error);

      }
}
const productUnblock = async (req, res) => {
      try {

            const productData = req.query._id;
            const data = await Product.findByIdAndUpdate(productData, { is_blocked: false })
            res.redirect("/admin/adminProduct");

      } catch (error) {
            console.log(error);

      }
}


const deleteImage = async (req, res) => {
      try {
            console.log("delete image request received");
            const pid = req.body.id;
            const index = req.body.index
            const prodata = await Product.findById(pid);

            if (prodata.image.length <= 1) {
                  return res.json({ status: "error", message: "Cannot delete the only remaining image." });
            }
             const imagedelete = prodata.image[index];

            fs.unlink(imagedelete, (err) => {
                  if (err) {
                        console.error("Error deleting the image file:", err);
                  } else {
                        console.log('Image file deleted successfully');
                  }
            });
            prodata.image.splice(index, 1);
            await prodata.save();

            res.json({ status: "delete", message: "Image deleted successfully." });
      } catch (err) {

            console.log(err.message)
      }
};






module.exports = {
      loadAddpro,
      addProduct,
      editProduct,
      productBlock,
      productUnblock,
      editPro,
      deleteImage,



}

