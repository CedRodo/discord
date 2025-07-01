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
    console.log("users:", users);
    console.log("socket id:", socket.id);
    socket.on('new-user', user => {
        console.log("new user:", user.username);
        users[socket.id] = user;
        socket.broadcast.emit('user-connected', user);
    });
    socket.on('send-chat-message', (message, name) => {
        console.log("send-chat-message message:", message);
        console.log("send-chat-message name:", name);
        console.log("send-chat-message sender:", users[socket.id]);

        // socket.broadcast.emit('chat-message', { message: message, user: users[socket.id] });
        socket.to(name).emit('receive-chat-message', { message: message, sender: users[socket.id] });
    });
    socket.on('join-room', (roomName, userName) => {
        socket.join(roomName);
        if (!rooms[roomName]) {
            Object.defineProperty(rooms, roomName, { value: {}, enumerable: true, writable: true });
            console.log("rooms[roomName]:", rooms[roomName]);        
            if (!rooms[roomName]["users"]) {
                Object.defineProperty(rooms[roomName], "users", { value: {}, enumerable: true, writable: true });
                console.log("rooms[roomName]['users']:", rooms[roomName]["users"]);
                if (!rooms[roomName]["users"][socket.id]) {
                    Object.defineProperty(rooms[roomName]["users"], socket.id, { value: "", enumerable: true, writable: true });
                    console.log("rooms[roomName]['users'][socket.id]:", rooms[roomName]["users"][socket.id]);    
                }
            }
        }
        rooms[roomName]["users"][socket.id] = userName;
        console.log("rooms:", rooms);
        // socket.to(roomName).emit('room-joined', { room: roomName, user: users[socket.id] });
        socket.broadcast.emit('room-joined', { room: roomName, user: users[socket.id] });
    });
    socket.on('disconnect', () => {
        console.log("disconnect:", users[socket.id]);
        // socket.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    });
});