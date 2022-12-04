const { authJwt , access } = require("../../middleware");
//const user_controller = require("../controllers/user.controller");
const { payment_controller} = require("../../controllers");
const { validatePaymentInputs} = require("../../validators/validatorUtils");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/payment/get/all",[authJwt.verifyToken], payment_controller.findAllCards);

  app.get("/api/payment/get",[authJwt.verifyToken], payment_controller.findOneCard);

  app.post("/api/payment/add",[authJwt.verifyToken, access.isAdmin,validatePaymentInputs], payment_controller.add);

  app.put("/api/payment/update",[authJwt.verifyToken, access.isAdmin,validatePaymentInputs], payment_controller.updateOneCard);

  app.delete("/api/payment/delete",[authJwt.verifyToken, access.isAdmin], payment_controller.deleteOneCard);

  app.get("/api/payment/search",[authJwt.verifyToken], payment_controller.search);
};
