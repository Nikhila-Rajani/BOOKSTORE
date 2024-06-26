const multer = require("multer");
const path = require("path");


const proStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    }
  });


  const upload = multer({ storage : proStorage})

  module.exports = upload