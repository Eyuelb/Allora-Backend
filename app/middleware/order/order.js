

const db = require("../../models");
const Order = db.order;
const generateOrderId = (req, res, next) => {

  
 
  Order.findAndCountAll().then(order => {
    if (!order.count) {
        next();
    }

    if (order.count) {
        let orderlastId =  parseInt(order.count) + 1;
        const time = new Date().getTime();
        const unknownCode = parseInt(orderlastId) * time
        let orderId ="Al"+"-"+req.userId+"-"+unknownCode+"-"+orderlastId
        req.orderId = orderId
        next();
        //return res.status(200).send({num:req.orderId});
      }
  }).catch(err => {
    err.message  || {message: "Error while generating OrderId"}
  });
}
  module.exports = {
    generateOrderId
  };