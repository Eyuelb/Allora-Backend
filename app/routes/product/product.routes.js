const { authJwt , access } = require("../../middleware");
const { product_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/product/get/all",[], product_controller.findAllProducts);

  app.get("/api/product/get",[], product_controller.findOneProduct);

  app.post("/api/product/add",[authJwt.verifyToken, access.isAdmin], product_controller.add);

  app.put("/api/product/update",[authJwt.verifyToken, access.isAdmin], product_controller.updateOneProduct);

  app.delete("/api/product/delete",[authJwt.verifyToken, access.isAdmin], product_controller.deleteOneProduct);

  app.get("/api/product/search",[], product_controller.search);

};
