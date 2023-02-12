import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io'
import handlebars from 'express-handlebars';
import morgan from 'morgan';
import __dirname from './utils.js'
import config from './config/index.js';
import router from './router/index.js';
import ChatManager from "./dao/mongoDB/chatManager.mongoDb.js";


const port = config.port;
const { userDB, passDB, hostDB } = config.db
const chm = new ChatManager();

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${userDB}:${passDB}@${hostDB}/?retryWrites=true&w=majority`, error => {
    if(error) {
        console.log(`Cannot connect with db. Error: ${error}`);
    }
})

router(app);

const httpServer = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})

const io = new Server(httpServer);

export default io;

const socket = io.on('connection', socket => {
    console.log(`New client connected with id ${socket.id}`);

    socket.on('userConnected', data => {
        socket.broadcast.emit('showNotification', data)
    })

    socket.on('retrieveLog', async () => {
        try {
            const log = await chm.getMessages()
            io.emit('sendLog', log);
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('messageSend', async data => {
        try {
            await chm.addMessageToDB(data);
            io.emit('showMessageOnScreen', data);
        } catch (error) {
            console.log(error)
        }
    })
})



