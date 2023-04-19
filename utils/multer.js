const multer = require("multer");
const path = require("path");
// Multer config

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files')
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    if (file.originalname === "blob") {
      file.originalname += '.mp3'
    }
    cb(null, Date.now() + file.originalname)
  }
})

const multerProfile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (file.fieldname === "image") {
      let ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif") {
        cb(new Error("File type is not supported for profile picture"), false);
        return;
      }
    }
    else if (file.fieldname === "resume") {
      let ext = path.extname(file.originalname);
      if (ext !== ".pdf") {
        cb(new Error("File type is not supported for resume"), false);
        return;
      }
    }
    else {
      cb(new Error("Invalid field. Possible fields are image and resume"), false);
      return;
    }
    cb(null, true);
  },
});

const multerAll = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});


module.exports = {
  multerProfile, multerAll
}