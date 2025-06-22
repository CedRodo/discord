const room = new Room({
    name: "Test Room",
    avatar: "discord_logo.png",
    visibility: "public"
});
const privateMessages = new PrivateMessages();

const user1 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "UserPrivate1234",
    username: "userprivate1234",
    date: "30 mars 2020",
    color: "#ffff00",
    avatar: { image: "discord_logo.png", bgcolor: "#996998" },
    status: "online"
});
room.addUser(user1);

const user2 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "OtherUserPrivate",
    username: "otheruser",
    date: "25 septembre 2021",
    color: "#dc143c",
    avatar: { image: "discord_logo.png", bgcolor: "#70c31d" },
    status: "online"
});
room.addUser(user2);

const user3 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "OfflineUser",
    username: "offlineuser",
    date: "7 janvier 2016",
    color: "#763cd4",
    avatar: { image: "discord_logo.png", bgcolor: "#af0b0b" },
    status: "offline"
});
room.addUser(user3);

const user4 = new User({
    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
    name: "NotVisibleUser87",
    username: "notvisibleuser87",
    date: "11 avril 2019",
    color: "#16a03f",
    avatar: { image: "discord_logo.png", bgcolor: "#9d6bee" },
    status: "offline"
});
room.addUser(user4);

console.log("room:", room);

const chatUser1 = new ChatUser(user1);
// privateMessages.addChatUser(chatUser1);
const chatUser2 = new ChatUser(user2);
privateMessages.addChatUser(chatUser2);
const chatUser3 = new ChatUser(user3);
privateMessages.addChatUser(chatUser3);
const chatUser4 = new ChatUser(user4);
privateMessages.addChatUser(chatUser4);
console.log("privateMessages:", privateMessages);

// const chat = new Chat();

// chat.messageToSend.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//         if (event.currentTarget.value === "") return;
//         const message = new Message(event.currentTarget.value);
//         console.log("message:", message);
//         chat.sendMessage(chatUser1, message);
//         event.currentTarget.value = "";
//     }
//     if (event.key === "Pause") {
//         if (event.currentTarget.value === "") return;
//         const message = new Message(event.currentTarget.value);
//         console.log("message:", message);
//         chat.sendMessage(chatUser2, message);
//         event.currentTarget.value = "";
//     }
// });

const sidebarButtons = document.querySelectorAll(".sidebar_button");

sidebarButtons.forEach((button) => {
    button.addEventListener("click", sidebarButtonsActivation);
});

function sidebarButtonsActivation(event) {
    sidebarButtons.forEach(button => button.classList.remove("active"));
    event.currentTarget.classList.add("active");
}

const leftPanelButtons = document.querySelectorAll(".left_panel_button");

leftPanelButtons.forEach((button) => {
    button.addEventListener("click", leftPanelButtonsActivation);
});

function leftPanelButtonsActivation(event) {
    leftPanelButtons.forEach(button => button.classList.remove("active"));
    event.currentTarget.classList.add("active");
    if (event.currentTarget.classList.contains("feature")) showFeature(event.currentTarget.dataset.feature);
    if (event.currentTarget.classList.contains("user_private-container")) showChatUser(event.currentTarget.dataset.ref);
}

function showFeature(feature) {
    switch (feature) {
        case "friends":
            break;
        case "nitro":
            break;
        case "shop":
            break;
    }
}

function showChatUser(chatUserRef) {
    console.log("chatUserRef:", chatUserRef);    
    const chatUserToShow = privateMessages.chatUsersList.find(chatUser => {
        console.log("chatUser.ref:", chatUser.ref);        
        return chatUser.ref === chatUserRef;
    });
    console.log("chatUserToShow:", chatUserToShow);
    
    chatUserToShow.showProfile();
    chatUserToShow.chat.showChatUser();
}
