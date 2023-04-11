const { authJwt , access } = require("../../middleware");
const { language_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/language/get/all",[authJwt.verifyToken], language_controller.findAllLanguages);

  app.get("/api/language/get",[authJwt.verifyToken], language_controller.findOneLanguage);

  app.post("/api/language/add",[authJwt.verifyToken, access.isAdmin], language_controller.addLanguage);

  app.put("/api/language/update",[authJwt.verifyToken, access.isAdmin], language_controller.updateOneLanguage);

  app.delete("/api/language/delete",[authJwt.verifyToken, access.isAdmin], language_controller.deleteOneLanguage);

  app.get("/api/language/search",[authJwt.verifyToken], language_controller.search);

};
