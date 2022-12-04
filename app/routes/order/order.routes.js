const { authJwt , access,order } = require("../../middleware");
const { order_controller,orderItems_controller,cart_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/order/get/all",[authJwt.verifyToken,access.isAdmin], order_controller.findAllOrders);

  app.get("/api/order/get",[authJwt.verifyToken,access.isAdmin], order_controller.findOneOrder);

  app.get("/api/order/get/orderedProduct",[authJwt.verifyToken,access.isAdmin], order_controller.findOneOrderedProduct);

 // app.post("/api/order/add",[authJwt.verifyToken], [cart_controller.add,order_controller.add]);
 app.post("/api/order/add",[authJwt.verifyToken,order.generateOrderId], [cart_controller.add,order_controller.add]);
  app.put("/api/order/update",[authJwt.verifyToken, access.isAdmin], order_controller.updateOneOrder);

  app.put("/api/order/update/status",[authJwt.verifyToken, access.isAdmin], order_controller.updateStatus);

  app.delete("/api/order/delete",[authJwt.verifyToken, access.isAdmin], order_controller.deleteOneOrder);

  app.get("/api/order/search",[authJwt.verifyToken,access.isAdmin], order_controller.search);

};
