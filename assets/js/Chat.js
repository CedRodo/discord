class Chat {
    chatUser;
    lastChatUserRef;
    chatWindow = document.querySelector(".chat_window");
    messageToSend = document.getElementById("message_to_send");
    constructor(chatUser) {
        this.chatUser = chatUser;
        this.eventListeners();
    }
    showChatUser(){
        document.querySelector(".chat_room_avatar-wrapper").style.setProperty("--bgcolor_pref", this.chatUser.avatar.bgcolor);
        document.querySelector(".chat_room_avatar").src = `./assets/img/${this.chatUser.avatar.image}`;
        document.querySelector(".chat_room_profile_status").dataset.status = this.chatUser.status;
        document.querySelector(".chat_room_name").textContent = this.chatUser.name;
    }
    eventListeners() {
        this.messageToSend.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                if (event.currentTarget.value === "") return;
                const message = new Message(event.currentTarget.value);
                console.log("message:", message);
                this.sendMessage(message);
                event.currentTarget.value = "";
            }
            if (event.key === "Pause") {
                if (event.currentTarget.value === "") return;
                const message = new Message(event.currentTarget.value);
                console.log("message:", message);
                this.sendMessage(message);
                event.currentTarget.value = "";
            }
        });
    }
    sendMessage(message) {
        if (this.checkIfSameLastChatUser(this.chatUser.ref)) {
            const chatMessageContainers = this.chatWindow.querySelectorAll(".chat_message-container");
            const lastChatMessageContainer = chatMessageContainers[chatMessageContainers.length - 1];
            console.log("lastChatMessageContainer:", lastChatMessageContainer);
            const chatMessageBottomSection = lastChatMessageContainer.querySelector(".chat_message-bottom_section");
            const chatMessage = message.createMessage();
            console.log("chatMessage:", chatMessage);
            chatMessageBottomSection.appendChild(chatMessage);
            const chatMessageDate = lastChatMessageContainer.querySelector(".chat_message_date");
            chatMessageDate.innerText = message.date.substring(0, message.date.length - 3);
        } else {
            console.log("new message");
            this.chatWindow.appendChild(this.createNewSection(message));
        }
        this.lastChatUserRef = this.chatUser.ref;
    }
    checkIfSameLastChatUser(chatUserRef) {
        if (this.lastChatUserRef !== null &&
            typeof this.lastChatUserRef !== "undefined" &&
            this.lastChatUserRef === chatUserRef) {
            return true;
        } else {
            return false;
        }
    }
    createNewSection(message) {
        console.log("createNewSection");
        const chatMessageContainer = document.createElement("div");
        chatMessageContainer.classList.add("chat_message-container");
        const chatMessageLeftSection = document.createElement("div");
        chatMessageLeftSection.classList.add("chat_message-left_section");
        const chatMessageUserAvatarWrapper = document.createElement("div");
        chatMessageUserAvatarWrapper.classList.add("chat_message_user_avatar-wrapper");
        chatMessageUserAvatarWrapper.style.setProperty("--bgcolor_pref", this.chatUser.avatar.bgcolor);
        const chatMessageUserAvatar = document.createElement("img");
        chatMessageUserAvatar.classList.add("chat_message_user_avatar");
        chatMessageUserAvatar.src = `./assets/img/${this.chatUser.avatar.image}`;
        chatMessageUserAvatarWrapper.appendChild(chatMessageUserAvatar);
        chatMessageLeftSection.appendChild(chatMessageUserAvatarWrapper);
        const chatMessageMainSection = document.createElement("div");
        chatMessageMainSection.classList.add("chat_message-main_section");
        const chatMessageTopSection = document.createElement("div");
        chatMessageTopSection.classList.add("chat_message-top_section");
        const chatMessageUserName = document.createElement("div");
        chatMessageUserName.classList.add("chat_message_user_name");
        chatMessageUserName.style.setProperty("--color_pref", this.chatUser.color);
        chatMessageUserName.innerText = this.chatUser.name;
        const chatMessageDate = document.createElement("div");
        chatMessageDate.classList.add("chat_message_date");
        chatMessageDate.innerText = message.date.substring(0, message.date.length - 3);
        chatMessageTopSection.append(chatMessageUserName, chatMessageDate);
        const chatMessageBottomSection = document.createElement("div");
        chatMessageBottomSection.classList.add("chat_message-bottom_section");
        const chatMessage = message.createMessage();
        chatMessageBottomSection.appendChild(chatMessage);
        chatMessageMainSection.append(chatMessageTopSection, chatMessageBottomSection);
        chatMessageContainer.append(chatMessageLeftSection, chatMessageMainSection);
        return chatMessageContainer;
    }
}