const fs = require('fs');
const db = require("../../models");
const { encryption, generateId ,uploadHelper } = require('../../utils');
const { productImages: ProductImages, product: Product } = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 30;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: products } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  const itemsPerPage = limit;

  return { totalItems, totalPages, currentPage, itemsPerPage, products };
};



exports.add = async (req, res) => {


  const singleImage = req.files.productMainImage;
  const MultipleImages = req.files.productAdditionalImages;

  

  if(!!singleImage){
   
  const singleImageId = await uploadHelper.uploadMultipleImages(singleImage,ProductImages);

  const MultipleImagesId = (!!MultipleImages) && await uploadHelper.uploadMultipleImages(MultipleImages,ProductImages)

  if(singleImageId){
    Product.create({...req.body,
      productId:generateId('Pro',8),
      productMainImageID: singleImageId[0], 
      productAdditionalImagesID:(!!MultipleImages)?MultipleImagesId:null
      }).then(product => {
  
      if (!product) {
        res.status(400).send({ message: "Error while saving products" });
      }
  
      if (product) {
        res.status(200).send(product);
      }
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    });
  
  }
  else{
    res.status(400).send({ message: "Error while saving products" });

  }
 
  }
  else{
    res.status(400).send({ message: "Error while saving products - Product Main Image missing" });

  }




} 
  
exports.getProductImage = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id ;
    
    const image = await ProductImages.findByPk((!!id)?id:0);
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

exports.findAllProducts = (req, res) => {
  const { page, size } = req.query;

  const { limit, offset } = getPagination(page - 1, size);
  let condition = req.query || req.body
  let id = (req.body.id) ? req.body.id : (req.query.id) ? req.query.id : null;
  let obj = {}

  if (id !== null) {
    Product.findAndCountAll({
      where: {
        id: id
      }, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Cart."
        });
      });
  }
  else {
    for (const key in condition) {
      if (key !== 'page' && key !== 'size' && key !== 'startPrice' && key !== 'endPrice')
        obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    }


    if (req.query.startPrice && req.query.endPrice || req.body.startPrice && req.body.endPrice) {
      obj[`productPrice`] = { [Op.between]: [req.query.startPrice || req.body.startPrice, req.query.endPrice || req.body.endPrice] };
    }

    Product.findAndCountAll({
      where: obj, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Cart."
        });
      });

  };
}
exports.findOneProduct = (req, res) => {
  const id = req.query.id

  Product.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving Product with id=" + id
      });
    });
};




exports.updateOneProduct = (req, res) => {
  const id = req.query.id;

  Product.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        return res.status(200).send({
          message: "Product was updated successfully."
        });
      } else {
        return res.status(400).send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};


exports.deleteOneProduct = (req, res) => {
  const id = req.query.id;

  Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        return res.status(200).send({
          message: "Product was deleted successfully!"
        });
      } else {
        return res.status(400).send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};


exports.search = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  let condition = req.query || req.body
  let id = (req.body.id) ? req.body.id : (req.query.id) ? req.query.id : null;
  let obj = {}

  if (id !== null) {
    Product.findAndCountAll({
      where: {
        id: id
      }, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Cart."
        });
      });
  }
  else {
    for (const key in condition) {

      obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    }

    Product.findAndCountAll({
      where: obj, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Cart."
        });
      });

  };








}
