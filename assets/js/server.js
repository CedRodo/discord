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
        let usersList = [];
        for (const sckt in users) {
            usersList.push(users[sckt]);
        }
        console.log("usersList:", usersList);
        io.emit('update-users', usersList);
    });
    socket.on('send-chat-message', (message, recipient, type) => {
        console.log("send-chat-message message:", message);
        console.log("send-chat-message recipient:", recipient);
        console.log("send-chat-message sender:", users[socket.id]);
        let name;
        if (type === "chatuser") {
            console.log("ChatUser");
            for (const sckt in users) {
                const user = users[sckt];
                if (user.ref === recipient.ref) name = sckt;
            }
            console.log("socket rooms:", socket.rooms);
            console.log("ChatUser name:", name);            
            socket.to(name).emit('send-message-notification', users[socket.id]);
        } else if (type === "rooms") {
            console.log("Room");
            name = recipient.name;
        }
        console.log("send-chat-message name:", name);
        io.to(name).emit('receive-chat-message', { message: message, sender: users[socket.id], recipient: recipient });
    });
    socket.on('room-users', async (roomName, type) => {
        console.log("room-users roomName:", roomName);        
        const sockets = await io.in(roomName).fetchSockets();
        // console.log("sockets:", sockets);
        const socketsIds = sockets.map(socket => socket.id);
        console.log("socketsIds:", socketsIds);
        const usersInRoom = socketsIds.map(id => users[id]);
        console.log("usersInRoom:", usersInRoom);
        io.emit('display-room-users', { roomName: roomName, users: usersInRoom }, type);
        // io.to(roomName).emit('display-room-users', { roomName: roomName, users: usersInRoom });
    });
    socket.on('join-room', (roomName) => {
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
        // let user;
        // for (const u in users) {
        //     if (users[u]["username"] === userName) user = users[u];
        // }
        // console.log("user:", user);        
        rooms[roomName]["users"][socket.id] = users[socket.id];
        console.log("rooms:", rooms);
        socket.emit('update-room', roomName, "join");
    });
    socket.on('leave-room', (roomName) => {
        socket.leave(roomName);
        for (const r in rooms) {
            if (rooms[r]["users"][socket.id]) {
                console.log("socket.id:", rooms[r]["users"][socket.id]);       
                // delete rooms[r]["users"][socket.id];
                socket.broadcast.emit('update-room', r);
            }
        }
        console.log("rooms:", rooms);
        socket.emit('update-room', roomName, "leave");
    });
    socket.on('update-local-user', (user) => {
        console.log("update-local-user:", user);
        for (const prop in users[socket.id]) {
            if (users[socket.id][prop] !== user[prop]) users[socket.id][prop] = user[prop];
        };
    });
    socket.on('join-user', (userName) => {
        console.log("join-user userName:", userName);
        let userSocket;
        for (const sckt in users) {
            const user = users[sckt];
            if (user.username === userName) userSocket = sckt;
        }
        console.log("userSocket:", userSocket);
        socket.join(userSocket);
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