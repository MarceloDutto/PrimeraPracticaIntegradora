import io from "./src/app";
import ChatManager from "./dao/mongoDB/chatManager.mongoDb.js";
const chm = new ChatManager();



io.on('userConnected', data => {
    socket.broadcast.emit('showNotification', data)
})

io.on('retrieveLog', async () => {
    try {
        const log = await chm.getMessages()
        io.emit('sendLog', log);
    } catch (error) {
        console.log(error);
    }
})

io.on('messageSend', async data => {
    try {
        await chm.addMessageToDB(data);
        io.emit('showMessageOnScreen', data);
    } catch (error) {
        console.log(error)
    }
})



