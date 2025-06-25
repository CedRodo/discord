class Chat {
    localChatUser;
    lastChatUserRef;
    chatWindow = document.querySelector(".chat_window");
    messageToSend = document.getElementById("message_to_send");
    message;
    privateMessages;
    constructor(localChatUser, privateMessages) {
        this.localChatUser = localChatUser;
        this.privateMessages = privateMessages;
        this.message = new Message("");
        this.eventListeners();
    }
    eventListeners() {
        this.messageToSend.addEventListener("input", event => {
            this.message.content = event.target.value;
            console.log("change this.message.content:", this.message.content);
        });
        this.messageToSend.addEventListener("keyup", (event) => {
            if (event.key === "Enter" && this.privateMessages.activeRemoteChatUser) {
                // if (event.currentTarget.value === "\n"){
                //     event.currentTarget.value.replace("\n", "");
                //     console.log("substring:", event.currentTarget.value);                    
                // }
                console.log("event.currentTarget.value:", event.currentTarget.value);
                console.log("this.message.content:", this.message.content);
                if (this.message.content === "") {
                    console.log("this.message.content === ''");                    
                    return;
                }
                console.log("this.message:", this.message);
                this.sendMessage(this.message);
                this.message.content = "";
                event.currentTarget.value = "";
            }
            if (event.key === "Pause") {
                if (event.currentTarget.value === "") return;
                const message = new Message(event.currentTarget.value);
                console.log("message:", message);
                this.sendMessage(message);
                event.currentTarget.value = "";
                setTimeout(() => { this.messageToSend.value = ""; }, 0);
            }
        });
    }
    async sendMessage(message) {
        if (this.checkIfSameLastChatUser(this.localChatUser.ref)) {
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
            this.chatWindow.appendChild(await this.createNewSection(message));
        }
        this.lastChatUserRef = this.localChatUser.ref;
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
    async createNewSection(message) {
        console.log("createNewSection");
        const chatMessageContainer = document.createElement("div");
        chatMessageContainer.classList.add("chat_message-container");
        const chatMessageLeftSection = document.createElement("div");
        chatMessageLeftSection.classList.add("chat_message-left_section");
        const chatMessageUserAvatarWrapper = document.createElement("div");
        chatMessageUserAvatarWrapper.classList.add("chat_message_user_avatar-wrapper");
        chatMessageUserAvatarWrapper.style.setProperty("--bgcolor_pref", this.localChatUser.avatar.bgcolor); const chatMessageUserProfileStatusWrapper = document.createElement("div");
        chatMessageUserProfileStatusWrapper.classList.add("chat_message_user_profile_status-wrapper");
        const chatMessageUserProfileStatus = document.createElement("div");
        chatMessageUserProfileStatus.classList.add("chat_message_user_profile_status");
        chatMessageUserProfileStatus.setAttribute("data-status", this.localChatUser.status === "notvisible" ? "offline" : this.localChatUser.status);
        chatMessageUserProfileStatusWrapper.appendChild(chatMessageUserProfileStatus);
        const chatMessageUserAvatar = document.createElement("img");
        chatMessageUserAvatar.classList.add("chat_message_user_avatar");
        chatMessageUserAvatar.src = `./assets/img/${this.localChatUser.avatar.image}`;
        chatMessageUserAvatarWrapper.append(chatMessageUserAvatar, chatMessageUserProfileStatusWrapper);
        chatMessageLeftSection.appendChild(chatMessageUserAvatarWrapper);
        const chatMessageMainSection = document.createElement("div");
        chatMessageMainSection.classList.add("chat_message-main_section");
        const chatMessageTopSection = document.createElement("div");
        chatMessageTopSection.classList.add("chat_message-top_section");
        const chatMessageUserName = document.createElement("div");
        chatMessageUserName.classList.add("chat_message_user_name");
        chatMessageUserName.style.setProperty("--color_pref", this.localChatUser.color);
        chatMessageUserName.innerText = this.localChatUser.name;
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