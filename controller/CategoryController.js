const User = require("../model/userModel");
const Category = require("../model/CategoryModel");


const adminCategory = async (req, res) => {
      try {
            const catData = await Category.find({})
            res.render('admin/adminCategory', { catData })

      } catch (error) {
            console.log(error);

      }
}
///////////create category post////////////////////////
const addCategory = async (req, res) => {
      try {
            const catData = await Category.find({})
            const { catname, catdescription } = req.body;
            const existingCategory = await Category.findOne({name:catname})
            // console.log(existingCategory);
            if(!existingCategory){
                  const newCategory = new Category({
                        name: catname,
                        description: catdescription
                  })
                  const findCategory = await newCategory.save();
            console.log(findCategory);
            res.redirect("/admin/adminCategory")
            }else{
                  console.log("Category already Exists");
                  res.render("admin/adminCategory",{message:"Category already Exists",catData},);
            }
            
            



      } catch (error) {
            console.log(error);

      }
}
//////////////loading editing category////////////////
const loadEdit = async (req, res) => {
      try {
            const id = req.query.id
            const catData = await Category.findById({ _id: id })
            const {name,description} = catData
            // res.render('admin/editCategory', { catData });

            const data = {
                  name,
                  description
            }

            req.session.catData = data
            req.session.save();
            res.render("admin/editCategory", { catData })


      } catch (error) {
            console.log(error);

      }
}
////////////editing category//////
const editcat = async (req, res) => {
      try {
            // console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")

            const name = req.body.name
            const description = req.body.description
            const id = req.body.id

            // console.log(name, description, id);

            const allData = await Category.find({})
            const allName = allData.map((x) => x.name)
            let unique = false;
            for (i = 0; i < allName.length; i++) {
                  if (name.toLowerCase() == allName[i].toLowerCase()) {
                        unique = true
                  }
            }


            if (name == req.session.catData.name) {
                  unique = false;
            }

            if (unique) {
                  res.json({ status: "unique" })
            } else {
                  // console.log("helooooo")

                  const catData = await Category.findByIdAndUpdate({ _id: id }, {
                        $set: {
                              name: name,
                              description
                        }
                  })
                  res.json({ status: true })
            }

      } catch (error) {
            console.log(error);
      }
}

const blockunblock = async(req,res)=>{
      try {
            // console.log("hello");
            const catid = req.body.id;
            const categoryData = await Category.findById(catid);
         if(categoryData.is_blocked === false){
            categoryData.is_blocked = true;


         }else if(categoryData.is_blocked === true){
            categoryData.is_blocked = false;

            
         }
         await categoryData.save();
         res.json({status:true})
            
      } catch (error) {
            console.log(error);
            
      }
}



module.exports = {
      adminCategory,
      addCategory,
      loadEdit,
      editcat,
      blockunblock,


}

