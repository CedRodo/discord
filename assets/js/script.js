const app = new App();

const server1 = new AppServer({
    name: "Server 1",
    avatar: { image: "discord_logo.png", bgcolor: "#5865F2" },
    visibility: "public"
});

const room1 = new Room({
    name: "room 1",
    visibility: "public"
});

const room2 = new Room({
    name: "room 2",
    visibility: "public"
});

server1.addRoom(room1);
server1.addRoom(room2);

app.addServer(server1);

const privateMessages = new PrivateMessages();

const user1 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "OnlineUser1234",
    username: "onlineuser1234",
    date: "30 mars 2020",
    color: "#ffff00",
    avatar: { image: "discord_logo.png", bgcolor: "#996998" },
    status: "online",
    local: false
});
room1.addUser(user1);
room2.addUser(user1);

const user2 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "BusyUser",
    username: "busyuser",
    date: "25 septembre 2021",
    color: "#dc143c",
    avatar: { image: "discord_logo.png", bgcolor: "#70c31d" },
    status: "busy",
    local: false
});
room1.addUser(user2);

const user3 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "SleepUser94240",
    username: "imspleeping",
    date: "2 december 2017",
    color: "#b53fb5",
    avatar: { image: "discord_logo.png", bgcolor: "#e7c2de" },
    status: "sleep",
    local: false
});
room1.addUser(user3);

const user4 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "OfflineUser",
    username: "offlineuser",
    date: "7 janvier 2016",
    color: "#763cd4",
    avatar: { image: "discord_logo.png", bgcolor: "#af0b0b" },
    status: "offline",
    local: false
});
room1.addUser(user4);
room2.addUser(user4);

const user5 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "NotVisibleUser87",
    username: "notvisibleuser87",
    date: "11 avril 2019",
    color: "#16a03f",
    avatar: { image: "discord_logo.png", bgcolor: "#9d6bee" },
    status: "notvisible",
    local: false
});
room1.addUser(user5);

const localUser = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "localUser",
    username: "localone",
    date: "29 december 2022",
    color: "#c6ade1",
    avatar: { image: "discord_logo.png", bgcolor: "#5fc4be" },
    status: "online",
    local: true
});
room1.addUser(user5);

console.log("room1:", room1);

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
