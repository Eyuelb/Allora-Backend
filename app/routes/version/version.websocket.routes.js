const { version_websocket_controller} = require("../../controllers");

module.exports =  (io) => {

    const singleChatUsers = {};

    io.on('connection', async (socket) => {
      // setInterval( async function(){
      //   const tableVersion = await version_websocket_controller.getAllTableVersion()
      //  // console.log(tableVersion)
      //   socket.emit('fech_data', tableVersion);    
      // }, 10000);


      socket.on('online', () => {


      });
    
      socket.on('singlechat_message', (message) => {
        const username = singleChatUsers[socket.id];
        if (!username) {
          return socket.emit('singlechat_error', 'You are not connected to the chat');
        }
        console.log(`${username}: ${message}`);
        socket.broadcast.emit('singlechat_message', `${username}: ${message}`);
      });
    
      socket.on('disconnect', () => {
        const username = singleChatUsers[socket.id];
        if (username) {
          console.log(`${username} left the single chat`);
          delete singleChatUsers[socket.id];
          socket.broadcast.emit('singlechat_message', `${username} left the chat`);
        }
      });
    });

};
 