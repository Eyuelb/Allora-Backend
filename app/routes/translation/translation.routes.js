const fs = require('fs');
const path = require('path');

const { authJwt, access } = require("../../middleware");
const { translation_controller } = require("../../controllers");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/translation/get/all", [], translation_controller.allTranslations);

  app.get("/api/translation/get", [authJwt.verifyToken], translation_controller.findOneTranslation);

  app.post("/api/translation/add", [authJwt.verifyToken, access.isAdmin], translation_controller.addTranslation);

  app.put("/api/translation/update",[authJwt.verifyToken, access.isAdmin], translation_controller.updateTranslation);

  app.delete("/api/translation/delete", [authJwt.verifyToken, access.isAdmin], translation_controller.deleteTranslation);

  app.get("/api/translation/search", [authJwt.verifyToken], translation_controller.search);

};
