const fs = require('fs');
const  encryption  = require('./encryption');
const  compression  = require('./compression');




const uploadMultipleImages = async (ImageFile,DBModel) => {
    // Array to hold the uploaded images
    const ImageId = [];

    for (let i = 0; i < ImageFile.length; i++) {
      const { originalname, mimetype, path, size } = ImageFile[i];
  
      // Read the file data into a buffer
      const compressImage = await compression.compressImage(path, path, 70)
      
      console.log("compressImage")
      console.log(compressImage)

      
      // Encrypt the file data
      const encryptedData = encryption.encryptData(compressImage);
      console.log("encryptedData")
      console.log(encryptedData)


      // Store the encrypted image in the database
      const image = await DBModel.create({
        name: originalname,
        type: mimetype,
        size, 
        iv: encryptedData.iv,
        data: encryptedData.data,
      });
  
      ImageId.push(image.id); 
      fs.unlinkSync(path);
    }
  
    return ImageId;

  };


  const uploadHelper = {
    uploadMultipleImages:uploadMultipleImages
  }
  
  module.exports = uploadHelper;