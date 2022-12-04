const { authJwt , access } = require("../../middleware");
const { brand_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/brand/get/all",[authJwt.verifyToken], brand_controller.findAllBrands);

  app.get("/api/brand/get",[authJwt.verifyToken], brand_controller.findOneBrand);

  app.post("/api/brand/add",[authJwt.verifyToken, access.isAdmin], brand_controller.add);

  app.put("/api/brand/update",[authJwt.verifyToken, access.isAdmin], brand_controller.updateOneBrand);

  app.delete("/api/brand/delete",[authJwt.verifyToken, access.isAdmin], brand_controller.deleteOneBrand);

  app.get("/api/brand/search",[authJwt.verifyToken], brand_controller.search);

};
