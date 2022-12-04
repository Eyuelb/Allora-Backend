const { authJwt , access } = require("../../middleware");
const { category_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/category/get/all",[], category_controller.findAllCategorys);

  app.get("/api/category/get",[], category_controller.findOneCategory);

  app.post("/api/category/add",[authJwt.verifyToken, access.isAdmin], category_controller.add);

  app.put("/api/category/update",[authJwt.verifyToken, access.isAdmin], category_controller.updateOneCategory);

  app.delete("/api/category/delete",[authJwt.verifyToken, access.isAdmin], category_controller.deleteOneCategory);

  app.get("/api/category/search",[], category_controller.search);

};
