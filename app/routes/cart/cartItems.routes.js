const { authJwt , access } = require("../../middleware");
const { cartItems_controller,cart_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/cart/get/all",[authJwt.verifyToken], cart_controller.findAllCarts);

  app.get("/api/cart/get",[authJwt.verifyToken], [cart_controller.add,cart_controller.findOneCart]);


  app.delete("/api/cart/delete",[authJwt.verifyToken], cart_controller.deleteOneCart);

  app.get("/api/cart/search",[authJwt.verifyToken], cart_controller.search);


  app.get("/api/cartItems/get/list",[authJwt.verifyToken], [cart_controller.add,cart_controller.findOneCart]);

  app.post("/api/cartItems/add",[authJwt.verifyToken], [cart_controller.add,cartItems_controller.add]);
  
  app.put("/api/cartItems/quantity/add",[authJwt.verifyToken], [cart_controller.add,cartItems_controller.AddOneCartItemProductQuantity]);

  app.put("/api/cartItems/quantity/delete",[authJwt.verifyToken], [cart_controller.add,cartItems_controller.deleteOneCartItemProductQuantity]);

  app.delete("/api/cartItems/deleteOne",[authJwt.verifyToken], cartItems_controller.deleteOneCartItem);

  app.delete("/api/cartItems/deleteAll",[authJwt.verifyToken], cartItems_controller.deleteAllCartItem);

  app.get("/api/cartItems/search",[authJwt.verifyToken], cartItems_controller.search);  

};
