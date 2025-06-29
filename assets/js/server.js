import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost"
    }
});

httpServer.listen(3000);

const users = {};
const rooms = {};

io.on('connection', socket => {
    console.log("socket id:", socket.id);
    socket.on('new-user', user => {
        console.log("new user:", user);
        users[socket.id] = user;
        console.log("users:", users);
        socket.broadcast.emit('user-connected', user);
    });
    socket.on('send-chat-message', (message, user) => {
        console.log("send-chat-message message:", message);
        console.log("send-chat-message user name:", user.name);
        socket.broadcast.emit('chat-message', { message: message, user: users[socket.id] })
    })
    socket.on('disconnect', () => {
        // console.log("disconnect:", users[socket.id]);
        // socket.emit('user-disconnected', users[socket.id])
        // delete users[socket.id]
    })
})