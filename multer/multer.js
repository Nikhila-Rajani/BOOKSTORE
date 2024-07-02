const multer = require("multer");
const path = require("path");

const proStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const imageFilter = function (req, file, cb) {
 
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: proStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;
