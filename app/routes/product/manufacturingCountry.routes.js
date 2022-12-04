const { authJwt , access } = require("../../middleware");
const { manufacturingCountry_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/manufacturingCountry/get/all",[], manufacturingCountry_controller.findAllManufacturingCountrys);

  app.get("/api/manufacturingCountry/get",[], manufacturingCountry_controller.findOneManufacturingCountry);

  app.post("/api/manufacturingCountry/add",[authJwt.verifyToken, access.isAdmin], manufacturingCountry_controller.add);

  app.put("/api/manufacturingCountry/update",[authJwt.verifyToken, access.isAdmin], manufacturingCountry_controller.updateOneManufacturingCountry);

  app.delete("/api/manufacturingCountry/delete",[authJwt.verifyToken, access.isAdmin], manufacturingCountry_controller.deleteOneManufacturingCountry);

  app.get("/api/manufacturingCountry/search",[], manufacturingCountry_controller.search);

};
