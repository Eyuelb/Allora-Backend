const { authJwt , access } = require("../../middleware");
const { cart_controller,cartItems_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  // app.get("/api/cart/get/all",[authJwt.verifyToken], cart_controller.findAllCarts);

  // app.get("/api/cart/get",[authJwt.verifyToken], [cart_controller.add,cart_controller.findOneCart]);

  

  // app.delete("/api/cart/delete",[authJwt.verifyToken, access.isAdmin], cart_controller.deleteOneCart);

  // app.get("/api/cart/search",[authJwt.verifyToken], cart_controller.search);

};
