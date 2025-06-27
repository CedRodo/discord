const app = new App();
const settings = new Settings();
const privateMessages = new PrivateMessages();

const server1 = new AppServer({
    name: "Server 1",
    avatar: { image: "discord_logo.png", bgcolor: "#5865F2" },
    visibility: "public"
});

app.addServer(server1);

const user1 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "OnlineUser1234",
    username: "onlineuser1234",
    date: "30 mars 2020",
    // color: "#ffff00",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    // avatar: { image: "discord_logo.png", bgcolor: "#996998" },
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "online",
    local: false
});

const user2 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "BusyUser",
    username: "busyuser",
    date: "25 septembre 2021",
    // color: "#dc143c",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    // avatar: { image: "discord_logo.png", bgcolor: "#70c31d" },
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "busy",
    local: false
});

const user3 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "SleepUser94240",
    username: "imspleeping",
    date: "2 december 2017",
    // color: "#b53fb5",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    // avatar: { image: "discord_logo.png", bgcolor: "#e7c2de" },
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "sleep",
    local: false
});

const user4 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "OfflineUser",
    username: "offlineuser",
    date: "7 janvier 2016",
    // color: "#763cd4",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    // avatar: { image: "discord_logo.png", bgcolor: "#af0b0b" },
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "offline",
    local: false
});

const user5 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "NotVisibleUser87",
    username: "notvisibleuser87",
    date: "11 avril 2019",
    // color: "#16a03f",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    // avatar: { image: "discord_logo.png", bgcolor: "#9d6bee" },
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "invisible",
    local: false
});

// const localUser = new User({
//     ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
//     name: "localUser",
//     username: "localone",
//     date: "29 decembre 2022",
//     color: "#c6ade1",
//     avatar: { image: "discord_logo.png", bgcolor: "#5fc4be" },
//     status: "online",
//     local: true
// });

// const localUser = new User({
//     ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
//     name: prompt('Name:'),
//     username: prompt('Username:'),
//     date: new Date().toLocaleString("fr-FR"),
//     color: prompt('Text color:'),
//     avatar: { image: "discord_logo.png", bgcolor: prompt('Background color:') },
//     status: "online",
//     local: true
// });

let colorsList = [];

const localUser = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: prompt('Name:'),
    username: "",
    date: new Date().toLocaleString("fr-FR"),
    // color: "salmon",
    color: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)],
    // avatar: { image: "discord_logo.png", bgcolor: "gold" },
    avatar: { image: "discord_logo.png", bgcolor: settings.colorsList[Math.floor(Math.random() * settings.colorsList.length - 1)] },
    status: "online",
    local: true
});

localUser.username = localUser.name + "82";

console.log("localUser:", localUser);

app.setLocalUser(localUser);

console.log("privateMessages:", privateMessages);

const room1 = new Room({
    name: "room 1",
    visibility: "public"
}, privateMessages);

const room2 = new Room({
    name: "room 2",
    visibility: "public"
}, privateMessages);

console.log("room1:", room1);
console.log("room2:", room2);

server1.addRoom(room1);
server1.addRoom(room2);

const chatUser1 = new ChatUser(user1);
privateMessages.addChatUser(chatUser1);
const chatUser2 = new ChatUser(user2);
privateMessages.addChatUser(chatUser2);
const chatUser3 = new ChatUser(user3);
privateMessages.addChatUser(chatUser3);
const chatUser4 = new ChatUser(user4);
privateMessages.addChatUser(chatUser4);
const chatUser5 = new ChatUser(user5);
privateMessages.addChatUser(chatUser5);
console.log("privateMessages:", privateMessages);

room1.addUser(chatUser1);
room2.addUser(chatUser1);
room1.addUser(chatUser2);
room1.addUser(chatUser3);
room1.addUser(chatUser4);
room2.addUser(chatUser4);
room1.addUser(chatUser5);

const localChatUser = new ChatUser(localUser);

const chat = new Chat(localUser, privateMessages);

const sidebarButtons = document.querySelectorAll(".sidebar_button");

sidebarButtons.forEach((button) => {
    button.addEventListener("click", sidebarButtonsActivation);
});

function sidebarButtonsActivation(event) {
    sidebarButtons.forEach(button => button.classList.remove("active"));
    event.currentTarget.classList.add("active");
    if (event.currentTarget.classList.contains("show_private_messages-container")) showPrivateMessages();
    if (event.currentTarget.classList.contains("server-container")) showServer(event.currentTarget.dataset.name);
}

function showPrivateMessages() {
    console.log("showPrivateMessages");
    document.querySelector("main").dataset.view = "chatuser";
    document.querySelector(".chat_title").textContent = "Messages privés";
    document.querySelector(".chat_room_name-container").classList.add("hide");
    document.querySelector(".chat_user_profile_panel").classList.add("hide");
    document.querySelector(".chat_message_to_send-container").classList.add("hide"); 
    while (chat.chatWindow.firstChild) {
        chat.chatWindow.lastChild.remove();
    }
    chat.messageToSend.value = "";
    privateMessages.showChatUsers();
}

function showServer(serverName) {
    console.log("serverName:", serverName);
    document.querySelector("main").dataset.view = "rooms";
    document.querySelector(".chat_title").textContent = serverName;
    document.querySelector(".chat_room_name-container").classList.add("hide");
    while (chat.chatWindow.firstChild) {
        chat.chatWindow.lastChild.remove();
    }
    chat.messageToSend.value = "";
    const serverToShow = app.serversList.find(server => {
        console.log("server.name:", server.name);
        return server.name === serverName;
    });
    console.log("serverToShow:", serverToShow);

    serverToShow.showRooms();
}

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
