const db = require("../../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product,order:Order ,orderItems:OrderItems  } = db;
const { idExists, userIdExists, userExists, ifExists,add,findById } = require("../../validators/checker");
const { getCartProduct,getCartItems,getorderedProducts,copyCartProductToOrder } = require("../../lib/dbhelp");


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


exports.findOneOrderedProduct = async (req, res) => {
  const id = req.query.id || req.body.id || 0
  const result = await getorderedProducts(Order,id); 
  if(!result){
    return res.status(400).send({message:"Error retrieving Order with id=" + id});
   }
   else if(result){
    return res.status(200).send(result);
   }
   else{
    return res.status(500).send({message:"Error retrieving Order with id=" + id});
   }
};




exports.add = async (req, res) => {

  //validateAddressInputs(req.body)
  //validatePaymentInputs()
  let id = (!req.query.id)? req.cartId : req.query.id
  let result = await copyCartProductToOrder(id,User,Cart,CartItems,Product);

  if(result.message){
    return res.status(400).send(result.message);
   }
   else if(result){
    Order.create({
      orderId:req.orderId,
      userId:req.userId,
      orderedProducts:result
    //  shippingAddressId:req.body.shippingAddressId,
   //   billingAddressId:req.body.billingAddressId,
    //  paymentId:req.body.paymentId
    }).then(order => {  
        if(!order){
            res.status(400).send({ message: "Error while saving orders" });
        }
        if(order){
            res.status(200).send(order);
        }
        }).catch(err => {
          err.message  || {message: "Error while saving orders"}
        });
   //return res.status(200).send(result);
   }
   else{
     return res.status(500).send({message:"Error retrieving Order with id=" + id});
   }
    
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




exports.updateStatus = (req, res) => {


if (req.query.id && req.query.status) {
  const update = {status:req.query.status,handledBy:req.userId}
  Order.update(update, {
    where: { id: req.query.id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Order was updated successfully."
        });
      } else {
        res.status(400).send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
}
else if (req.body.id && req.body.status) {
  const update = {status:req.body.status,handledBy:req.userId}
  Order.update(update, {
    where: { id: req.body.id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Order was updated successfully."
        });
      } else {
        res.status(400).send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
} 
else if (req.query.id && req.query.viewed) {
  const update = {status:req.query.viewed,handledBy:req.userId}
  Order.update(update, {
    where: { id: req.query.id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Order was updated successfully."
        });
      } else {
        res.status(400).send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
}
else if (req.body.id && req.body.viewed) {
  const update = {status:req.body.viewed,handledBy:req.userId}
  Order.update(update, {
    where: { id: req.body.id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Order was updated successfully."
        });
      } else {
        res.status(400).send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
}
else {
  res.status(400).send({
    message: "Error updating Order"
  });

}

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
  var id = (req.body.id)?req.body.id:(req.query.id)?req.query.id:'';
  var obj = {}
  
if (id){
  Order.findAndCountAll({ 
  where:  {
    id:id}, limit, offset })
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
else{
for(const key in condition) {

  obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
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
        err.message || "Some error occurred while retrieving Cart."
    });
  });
};








}

