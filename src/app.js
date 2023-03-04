import { Server } from 'socket.io';
import { app, port } from './index.js';

const httpServer = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})

export const io = new Server(httpServer);

io.on('connection', socket => {
    console.log(`New client connected with id ${socket.id}`);
})

