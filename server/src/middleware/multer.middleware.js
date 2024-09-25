import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    console.log(file);
    // console.log(file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
