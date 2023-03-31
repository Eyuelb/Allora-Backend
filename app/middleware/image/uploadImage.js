const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/tempimage/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });



const uploadImageMiddleware = async (req, res, next) => {
  try{
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: 'Error uploading image', err });
      } else if (err) {
        return res.status(500).json({ message: 'Error uploading image', err });
      }
      // else{
      //   return res.status(200).json(req.file);

      // }
     next();
    })

  } catch (error) {
         return res.status(500).json({ message: 'Error uploading image', error });
       }
};
const uploadSingleImageMiddleware = async (req, res, next) => {
  try{
    upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: 'Error uploading image', err });
      } else if (err) {
        return res.status(500).json({ message: 'Error uploading image', err });
      }
      // else{
      //   return res.status(200).json(req.file);

      // }
     next();
    })

  } catch (error) {
         return res.status(500).json({ message: 'Error uploading image', error });
  }
};


const uploadMultipleImageMiddleware = (req, res, next) => {
  upload.fields([{ name: 'productMainImageFiles', maxCount: 1 },{ name: 'productAdditionalImagesFiles', maxCount: 5 }])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'Error uploading images-Middleware', err });
    } else if (err) {
      return res.status(500).json({ message: 'Error uploading images-Middleware', err });
    }
    next();
  });
};
const uploadMiddleware = {
  uploadImageMiddleware:uploadImageMiddleware,
  uploadSingleImageMiddleware:uploadSingleImageMiddleware,
  uploadMultipleImageMiddleware:uploadMultipleImageMiddleware
}
module.exports=uploadMiddleware
