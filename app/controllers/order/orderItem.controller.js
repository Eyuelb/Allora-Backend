const db = require("../../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product,orderItems:OrderItems  } = db;
const { idExists, userIdExists, userExists, ifExists } = require("../../validators/checker");
const { getCartProduct,getCartItems } = require("../../lib/dbhelp");


const Op = db.Sequelize.Op;



const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: orders } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , orders};
  };


exports.findAllOrders = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Order.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Orders."
        });
      });

};

exports.findOneOrder = (req, res) => {
  const id = req.query.id

  Order.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving Order with id=" + id
      });
    });
};




exports.add = async (req, res) => {

  //validateAddressInputs(req.body)
  //validatePaymentInputs()
  let id = (!req.query.id)? req.cartId : req.query.id
  let orderId = (!req.query.orderId)? req.orderId : req.query.orderId
  let result = await getCartItems(id,User,Cart,CartItems,Product);
  
  if(result.message){
    return res.status(400).send(result);
   }
   else if(result){


    OrderItems.create({orderId: req.cartId,productId: productId, quantity: quantity
    }).then(cartItems => {

      if (!cartItems) {
        res.status(400).send({ message: "Error while saving cartItems" });
      }

      if (cartItems) {
        res.status(200).send({ message: cartItems });
      }
    }).catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CartItems."
      });
    });
     return res.status(200).send(result.rows[0]);
   }
   else{
     return  res.status(500).send({message:"Error retrieving Cart with id=" + req.cartId});
   }

    // Order.create({
    //   userId:req.userId,
    //   shippingAddressId:req.body.shippingAddressId,
    //   billingAddressId:req.body.billingAddressId,
    //   paymentId:req.body.paymentId
    // }).then(order => {
         
    //     if(!order){
    //         res.status(400).send({ message: "Error while saving orders" });
    //     }

    //     if(order){
    //         res.status(200).send({ message: order });
    //     }
    //     }).catch(err => {
    //       return res.status(500).send({ message: err.message });
    //     });
    
};



exports.updateOneOrder = (req, res) => {
    const id = req.query.id;

Order.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Order was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
};


exports.deleteOneOrder = (req, res) => {
    const id = req.query.id;

Order.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Order was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete Order with id=" + id
      });
    });
};


exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
var obj = {}
for(const key in condition) {

  obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    //console.log(`${key}: ${condition[key]}`);
}


Order.findAndCountAll({ 
      where: obj , limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

