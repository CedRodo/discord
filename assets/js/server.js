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
    socket.on('room-users', async (roomName) => {
        console.log("room-users roomName:", roomName);        
        const sockets = await io.in(roomName).fetchSockets();
        // console.log("sockets:", sockets);
        const socketsIds = sockets.map(socket => socket.id);
        console.log("socketsIds:", socketsIds);
        const usersInRoom = socketsIds.map(id => users[id]);
        console.log("usersInRoom:", usersInRoom);
        io.emit('display-room-users', { roomName: roomName, users: usersInRoom });
        // io.to(roomName).emit('display-room-users', { roomName: roomName, users: usersInRoom });
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
        let user;
        for (const u in users) {
            if (users[u]["username"] = userName) user = users[u];
        }
        console.log("user:", user);        
        rooms[roomName]["users"][socket.id] = user;
        console.log("rooms:", rooms);
        socket.emit('update-room', roomName);
    });
    socket.on('disconnect', () => {
        console.log("disconnect:", users[socket.id]);
        for (const r in rooms) {
            if (rooms[r]["users"][socket.id]) {
                // console.log("socket.id:", rooms[r]["users"][socket.id]);             
                socket.broadcast.emit('update-room', r);
            }
        }
        delete users[socket.id];
    });
});