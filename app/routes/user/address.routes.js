const { authJwt , access } = require("../../middleware");
//const user_controller = require("../controllers/user.controller");
const { address_controller} = require("../../controllers");
const { validateAddressInputs} = require("../../validators/validatorUtils");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/address/get/all",[authJwt.verifyToken], address_controller.findAllAddresss);

  app.get("/api/address/get",[authJwt.verifyToken], address_controller.findOneAddress);

  app.post("/api/address/add",[authJwt.verifyToken, access.isAdmin,validateAddressInputs], address_controller.add);

  app.put("/api/address/update",[authJwt.verifyToken, access.isAdmin,validateAddressInputs], address_controller.updateOneAddress);

  app.delete("/api/address/delete",[authJwt.verifyToken, access.isAdmin], address_controller.deleteOneAddress);

  app.get("/api/address/search",[authJwt.verifyToken], address_controller.search);
};
