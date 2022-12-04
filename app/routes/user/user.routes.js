const { authJwt , access } = require("../../middleware");
//const user_controller = require("../controllers/user.controller");
const { user_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/user/get/all",[authJwt.verifyToken, access.isAdmin], user_controller.findAllUsers);

  app.get("/api/user/get",[authJwt.verifyToken], user_controller.findOneUser);

  app.put("/api/user/update",[authJwt.verifyToken], user_controller.updateOneUser);

  app.delete("/api/user/delete",[authJwt.verifyToken], user_controller.deleteOneUser);

  app.get("/api/user/search",[authJwt.verifyToken], user_controller.search);




  app.get("/api/test/all", user_controller.allAccess);
  app.get("/api/test/user",[authJwt.verifyToken],user_controller.userBoard);

  app.get("/api/test/mod",[authJwt.verifyToken, access.isModerator],user_controller.moderatorBoard);

  app.get("/api/test/admin",[authJwt.verifyToken, access.isAdmin],user_controller.adminBoard);
};
