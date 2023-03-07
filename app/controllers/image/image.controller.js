const db = require("../../models");
const fs = require('fs');
const { images: Images } = db
const { encryption, compression } = require('../../utils');
const crypto = require('crypto');


// function to handle image upload 
exports.uploadImage = async (req, res) => {
  try {
    const { originalname, mimetype, path, size } = req.file;

    // Read the file compress data into a buffer
    const compressImage = await compression.compressImage(path, path, 80)

    // Encrypt the file data
    const encryptedData = encryption.encryptData(compressImage);

    // Store the encrypted image in the database
    const image = await Images.create({
      name: originalname,
      type: mimetype,
      size,
      iv: encryptedData.iv,
      data: encryptedData.data,
    });

    fs.unlinkSync(path);
    return (image) && res.status(200).json(image);

  } catch (error) {
    return res.status(500).json({ message: 'Error uploading image', error });
  }



};

// function to handle image upload
exports.uploadMultipleImages = async (req, res) => {
  try {
  // Array to hold the uploaded images
  const images = [];


  for (let i = 0; i < req.files.images.length; i++) {
    const { originalname, mimetype, path, size } = req.files.images[i];

    // Read the file data into a buffer
    const compressImage = await compression.compressImage(path, path, 80)

    // Encrypt the file data
    const encryptedData = encryption.encryptData(compressImage);

    // Store the encrypted image in the database
    const image = await Images.create({
      name: originalname,
      type: mimetype,
      size,
      iv: encryptedData.iv,
      data: encryptedData.data,
    });

    images.push(image);
    fs.unlinkSync(path);
  }

  return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading images-Controller', error });
  }
};


// function to handle image retrieval
exports.getImage = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const image = await Images.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const decryptedData = await encryption.decryptData(image.data, image.iv);
    res.setHeader('Content-Type', image.type);
    res.setHeader('Content-Disposition', `inline; filename="${image.name}"`);
    res.send(decryptedData);

  } catch (error) {
    const key = crypto.randomBytes(32);

    return res.status(500).json({ message: 'Error retrieving image', key });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const { count, rows: images } = await Images.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const decryptedImages = await Promise.all(
      images.map(async (image) => {
        return {
          id: image.id,
          name: image.name,
        };
      })
    );

    const response = {
      images: decryptedImages,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
    };

    res.status(200).json(response);
  } catch (error) {
    const key = crypto.randomBytes(32);
    res.status(500).json({ message: 'Error retrieving images', key });
  }
};


