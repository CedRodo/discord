const socket = io('http://localhost:3000');
const app = new App();
const settings = new Settings();
app.setPrivateMessages(new PrivateMessages());

const server1 = new AppServer({
    name: "Server 1",
    avatar: { image: "discord_logo.png", bgcolor: "#5865F2" },
    visibility: "public"
});

app.addServer(server1);

const user1 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    email: "onlineuser1234@gmail.com",
    name: "OnlineUser1234",
    username: "onlineuser1234",
    password: "Abc12345*",
    date: "30 mars 2020",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "online",
    local: false
});

const user2 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    email: "busyuser@gmail.com",
    name: "BusyUser",
    username: "busyuser",
    password: "Abc12345*",
    date: "25 septembre 2021",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "busy",
    local: false
});

const user3 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    email: "imspleeping@gmail.com",
    name: "SleepUser94240",
    username: "imspleeping",
    password: "Abc12345*",
    date: "2 december 2017",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "sleep",
    local: false
});

const user4 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    email: "offlineuser@gmail.com",
    name: "OfflineUser",
    username: "offlineuser",
    password: "Abc12345*",
    date: "7 janvier 2016",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "offline",
    local: false
});

const user5 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    email: "notvisibleuser87@gmail.com",
    name: "NotVisibleUser87",
    username: "notvisibleuser87",
    password: "Abc12345*",
    date: "11 avril 2019",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "invisible",
    local: false
});

const room1 = new Room({
    name: "room 1",
    visibility: "public"
}, app.getPrivateMessages());

const room2 = new Room({
    name: "room 2",
    visibility: "public"
}, app.getPrivateMessages());

console.log("room1:", room1);
console.log("room2:", room2);

server1.addRoom(room1);
server1.addRoom(room2);

// app.getPrivateMessages().addChatUser(user1.getChatUser());
// app.getPrivateMessages().addChatUser(user2.getChatUser());
// app.getPrivateMessages().addChatUser(user3.getChatUser());
// app.getPrivateMessages().addChatUser(user4.getChatUser());
// app.getPrivateMessages().addChatUser(user5.getChatUser());
// console.log("app.privateMessages:", app.getPrivateMessages());

// room1.addUser(user1.getChatUser());
// room2.addUser(user1.getChatUser());
// room1.addUser(user2.getChatUser());
// room1.addUser(user3.getChatUser());
// room1.addUser(user4.getChatUser());
// room2.addUser(user4.getChatUser());
// room1.addUser(user5.getChatUser());

const register = new Register(app, settings);
const login = new Login(app, settings);

socket.on('user-connected', user => {
    console.log("user-connected:", user);    
    const chatUser = new ChatUser(user);
    app.getPrivateMessages().addChatUser(chatUser);
});

socket.on('update-room', roomName => {
    console.log("update-room:", roomName);
    socket.emit('room-users', roomName);
});

socket.on('receive-chat-message', data => {
    console.log("receive-chat-message data:", data);
    app.chat.sendMessage(new Message(data.message.content), data.user);
});

socket.on('display-room-users', data => {
    console.log("display-room-users:", data);
    const rooms = server1.getRooms();
    console.log("room-joined rooms:", rooms);
    const room = rooms.find(room => room.name === data.roomName);
    console.log("display-room-users room:", room);
    const users = data.users;
    console.log("room-joined users:", users);
    room.updateUsersList(users);
});






// const leftPanelButtons = document.querySelectorAll(".left_panel_button");

// leftPanelButtons.forEach((button) => {
//     button.addEventListener("click", leftPanelButtonsActivation);
// });

// function leftPanelButtonsActivation(event) {
//     leftPanelButtons.forEach(button => button.classList.remove("active"));
//     event.currentTarget.classList.add("active");
//     if (event.currentTarget.classList.contains("feature")) showFeature(event.currentTarget.dataset.feature);
//     if (event.currentTarget.classList.contains("user_private-container")) showChatUser(event.currentTarget.dataset.ref);
//     if (event.currentTarget.classList.contains("room-container")) showRoom(event.currentTarget.dataset.name);
// }

// function showFeature(feature) {
//     switch (feature) {
//         case "friends":
//             break;
//         case "nitro":
//             break;
//         case "shop":
//             break;
//     }
// }

// function showChatUser(chatUserRef) {
//     console.log("chatUserRef:", chatUserRef);    
//     const chatUserToShow = privateMessages.chatUsersList.find(chatUser => {
//         console.log("chatUser.ref:", chatUser.ref);        
//         return chatUser.ref === chatUserRef;
//     });
//     console.log("chatUserToShow:", chatUserToShow);
    
//     chatUserToShow.showProfile();
//     chatUserToShow.chat.showChatUser();
// }
