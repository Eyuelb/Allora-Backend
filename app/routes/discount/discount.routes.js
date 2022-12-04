const { authJwt , access } = require("../../middleware");
const { discount_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/discount/get/all",[authJwt.verifyToken], discount_controller.findAllDiscounts);

  app.get("/api/discount/get",[authJwt.verifyToken], discount_controller.findOneDiscount);

  app.post("/api/discount/add",[authJwt.verifyToken, access.isAdmin], discount_controller.add);

  app.put("/api/discount/update",[authJwt.verifyToken, access.isAdmin], discount_controller.updateOneDiscount);

  app.delete("/api/discount/delete",[authJwt.verifyToken, access.isAdmin], discount_controller.deleteOneDiscount);

  app.get("/api/discount/search",[authJwt.verifyToken], discount_controller.search);

};
