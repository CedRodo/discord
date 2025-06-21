const room = new Room({
    name: "Test Room",
    avatar: "discord_logo.png",
    visibility: "public"
});
const user1 = new User({
    ref: Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000,
    name: "UserPrivate1234",
    color: "#ffff00",
    avatar: { image: "discord_logo.png", bgcolor: "#996998" },
    status: "online"
});
room.addUser(user1);

const user2 = new User({
    ref: Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000,
    name: "OtherUserPrivate",
    color: "#dc143c",
    avatar: { image: "discord_logo.png", bgcolor: "#70c31d" },
    status: "online"
});
room.addUser(user2);

const user3 = new User({
    ref: Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000,
    name: "OfflineUser",
    color: "#763cd4",
    avatar: { image: "discord_logo.png", bgcolor: "#af0b0b" },
    status: "offline"
});
room.addUser(user3);

const user4 = new User({
    ref: Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000,
    name: "NotVisibleUser87",
    color: "#16a03f",
    avatar: { image: "discord_logo.png", bgcolor: "#9d6bee" },
    status: "offline"
});
room.addUser(user4);

console.log("room:", room);

const chatUser = new ChatUser(user1);
const chatUser2 = new ChatUser(user2);

const chat = new Chat();

chat.messageToSend.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (event.currentTarget.value === "") return;
        const message = new Message(event.currentTarget.value);
        console.log("message:", message);
        chat.sendMessage(chatUser, message);
        event.currentTarget.value = "";
    }
    if (event.key === "Pause") {
        if (event.currentTarget.value === "") return;
        const message = new Message(event.currentTarget.value);
        console.log("message:", message);
        chat.sendMessage(chatUser2, message);
        event.currentTarget.value = "";
    }
});

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
}


