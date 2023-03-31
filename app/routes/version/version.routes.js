const { authJwt , access } = require("../../middleware");
//const user_controller = require("../controllers/user.controller");
const { version_controller,version_websocket_controller} = require("../../controllers");
module.exports = function(app,io) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next(); 
  });

  

 // app.get("/api/version/get/all",[authJwt.verifyToken], version_controller.getAllTableVersion);

  app.get("/api/version/get",[authJwt.verifyToken], version_controller.getTableVersion);

  app.get('/api/version/get/all',[authJwt.verifyToken], async (req, res) => {
    // io.on('connection', async (socket) => {
    //   setInterval( async function(){
    //     const arrayholder = []
    //     const productstableVersion = await version_websocket_controller.getProductAllTableVersion()
    //     const tableVersion = await version_websocket_controller.getAllTableVersion()
    //     await productstableVersion.map((ptv)=>{
    //       arrayholder.push({groupId:ptv.productGroupIds,version:ptv.version})
    //     })
    //    // console.log(tableVersion)
    //     socket.emit('fech_data', arrayholder);    
    //   }, 10000);

    //   socket.on('disconnect', () => {
    //     console.log('client disconnect')

    //   });   
      
    // });
    const arrayholder = []
    const productstableVersion = await version_websocket_controller.getProductAllTableVersion()
    const tableVersion = await version_websocket_controller.getAllTableVersion()
    await productstableVersion.map((ptv)=>{
      arrayholder.push({groupId:ptv.productGroupIds,version:ptv.version})
    })
    res.status(200).send(arrayholder); 
  }); 


};
 