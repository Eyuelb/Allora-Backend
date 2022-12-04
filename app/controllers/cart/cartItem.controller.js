const { where } = require("sequelize");
const db = require("../../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product } = db;
const { idExists, ifIdExistsFind, userExists, ifExists } = require("../../validators/checker");
const Op = db.Sequelize.Op;


const getPagination = (page, size) => {
  const limit = size ? +size : 30;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: CartItems } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);


  return { totalItems, totalPages, currentPage, CartItems };
};


exports.findAllCartItems = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  CartItems.findAndCountAll({ limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.status(400).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CartItems."
      });
    });

};

exports.findOneCartItems = (req, res) => {
  const id = req.query.id

  CartItems.findByPk(id)
    .then(data => {
      if (data) {
        return res.status(200).send(data);
      }
      if (!data) {
        return res.status(500).send({ message: "Error retrieving CartItems with id=" + id });
      }

    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CartItems."
      });
    });

};


exports.add = async (req, res, next) => {

  const { productId, quantity } = req.body||req.query
  let result2 = await ifIdExistsFind(CartItems, { productId: productId });
if(result2.count === 0){

  let result = await idExists(Product, productId);
  if (result.count !== 0) {
    if (result.rows[0].productQuantity == 0) {
      return res.status(400).send({ message: "Product is out of stock" });
    }
    else if (result.rows[0].productMaximumQuantityAllowed < quantity) {
      return res.status(400).send({ message: "Product allowed quantity per sell is Maximum=" + result.rows[0].productMaximumQuantityAllowed + ". Please adjust ur quantity" });
    }
    else if (result.rows[0].productMinimumQuantityAllowed > quantity) {
      return res.status(400).send({ message: "Product allowed quantity per sell is Minimum=" + result.rows[0].productMinimumQuantityAllowed + ". Please adjust ur quantity" });
    }
    else {
      
        CartItems.create({
          cartId: req.cartId,
          productId: productId,
          quantity: quantity
        }).then(cartItems => {

          if (!cartItems) {
            res.status(400).send({ message: "Error while saving cartItems" });
          }

          if (cartItems) {
            res.status(200).send(cartItems);
          }
        }).catch(err => {
          return res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving CartItems."
          });
        });
      


    }


  }
  else {
    return res.status(500).send({ message: "ProductID=" + productId + " doesn't exist" });
  }


}
else if(result2.count !== 0){
  return res.status(400).send({ message: "ProductID=" + productId + " already exist" });
}
else{
  return res.status(500).send({ message: "ProductID=" + productId + " doesn't exist" });
}



};

exports.deleteOneCartItemProductQuantity = async (req, res) => {
  const productId = req.body.productId || req.query.productId

  if (productId) {
  let result = await idExists(Product, productId);
  if (result.count) {

      let result2 = await ifExists(CartItems, { productId: productId });
      if (result2.count) {
        const newQuantity = parseInt(result2.rows[0].quantity) - 1;

        if (newQuantity == 0) {
          CartItems.destroy({
            where: { id: result2.rows[0].id }
          })
            .then(num => {
              if (num == 1) {
                res.status(200).send({
                  message: "CartItems was deleted successfully!"
                });
              } else {
                res.status(400).send({
                  message: `Cannot delete CartItems with id=${result2.rows[0].id}. Maybe CartItems was not found!`
                });
              }
            })
            .catch(err => {
              return res.status(500).send({
                message:
                  err.message || "Could not delete CartItems with id=" + result2.rows[0].id
              });
            });
        }
        else {
          req.body.quantity = newQuantity;
          CartItems.update(req.body, {
            where: {
              id: result2.rows[0].id
            }
          })
            .then(num => {
              if (num == 1) {
                res.status(200).send({
                  message: newQuantity
                });
              } else {
                res.status(400).send({
                  message: `Cannot update CartItems with id=${result2.rows[0].id}. Maybe CartItems was not found!`
                });
              }
            })
            .catch(err => {
              return res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving CartItems."
              });
            });

        }


        //   return res.status(200).send({message:result2});
      }
      else {
        return res.status(400).send({ message: "ProductID=" + productId + " doesn't exist in CartItems" });
      }

  }
  else {
    return res.status(500).send({ message: "ProductID=" + productId + " doesn't exist" });
  }
  }
  else
  {
    return res.status(400).send({ message: "Invalid request" });
  }

};
exports.AddOneCartItemProductQuantity = async (req, res) => {
  const productId = req.body.productId || req.query.productId

  if (productId) {
  let result = await idExists(Product, productId);
  if (result.count) {

      let result2 = await ifExists(CartItems, { productId: productId });
      if (result2.count) {
        const newQuantity = parseInt(result2.rows[0].quantity) + 1;

        if (result.rows[0].productMaximumQuantityAllowed < newQuantity) {
          return res.status(400).send({ message: "Product allowed quantity per sell is Maximum=" + result.rows[0].productMaximumQuantityAllowed + ". Please adjust ur quantity" });
        }
        else {
          req.body.quantity = newQuantity;
          CartItems.update(req.body, {
            where: {
              id: result2.rows[0].id
            }
          })
            .then(num => {
              if (num == 1) {
                res.status(200).send({
                  message: newQuantity
                });
              } else {
                res.status(400).send({
                  message: `Cannot update CartItems with id=${result2.rows[0].id}. Maybe CartItems was not found!`
                });
              }
            })
            .catch(err => {
              return res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving CartItems."
              });
            });

        }


        //   return res.status(200).send({message:result2});
      }
      else {
        return res.status(400).send({ message: "ProductID=" + productId + " doesn't exist in CartItems" });
      }

  }
  else {
    return res.status(500).send({ message: "ProductID=" + productId + " doesn't exist" });
  }
  }
  else
  {
    return res.status(400).send({ message: "Invalid request" });
  }

};

exports.deleteOneCartItem = (req, res) => {
  const cartItemId = req.body.cartItemId || req.query.cartItemId 

  CartItems.destroy({
    where: { id: cartItemId }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "CartItems was deleted successfully!"
        });
      } else {
        res.status(400).send({
          message: `Cannot delete CartItems with id=${cartItemId}. Maybe CartItems was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Could not delete CartItems with id=" + cartItemId
      });
    });
};

exports.deleteAllCartItem = (req, res) => {
  const cartId = req.body.cartId || req.query.cartId || req.cartId

  CartItems.destroy({
    where: { cartId: cartId }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "CartItems was deleted successfully!"
        });
      } else {
        res.status(400).send({
          message: `Cannot delete CartItems with id=${cartId}. Maybe CartItems was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Could not delete CartItems with id=" + cartId
      });
    });
};

exports.search = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  var condition = req.body
  var obj = {}

  if (req.body.userId) {
    CartItems.findAndCountAll({
      where: {
        userId: req.body.userId
      }, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };


  if (!req.body.userId) {
    for (const key in condition) {

      obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    }

    CartItems.findAndCountAll({
      where: obj, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };


  if (req.body.id) {
    CartItems.findAndCountAll({
      where: {
        id: req.body.id
      }, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };

  if (!req.body.id) {
    for (const key in condition) {

      obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    }

    CartItems.findAndCountAll({
      where: obj, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };




}





