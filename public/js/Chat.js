class Chat {
    sameSender = false;
    log = { chatuser: {}, rooms: {} };
    message;
    constructor() {
        this.peer = null;
        this.message = new Message("");
    }

    sendMessage(message, sender, recipient) {
        console.log("sendMessage sender:", sender);
        console.log("sendMessage recipient:", recipient);
        let mode; let ref;
        if (recipient.ref.charAt(0) === "r") {
            mode = "rooms";
            ref = recipient.ref;
        } else {
            mode = "chatuser";
            ref = sender.ref === app.localUser.ref ? recipient.ref : sender.ref;
        }
        this.updateLog(message, sender, mode, ref);
        if (mode === app.mode) this.createMessageElements(mode, ref);
    }

    updateLog(message, sender, mode, ref) {
        let data = {
            chatUser: sender,
            message: message
        }
        if (!this.log[mode][ref]) {
            Object.defineProperty(this.log[mode], ref, { value: [], enumerable: true, writable: true });
            console.log("this.log[mode][ref]:", this.log[mode][ref]);
        }
        if (this.log[mode][ref].length > 0) {
            if (Object.keys(this.log[mode][ref].at(-1)).includes(sender.ref)) {
                this.log[mode][ref].at(-1)[sender.ref].push(data);
                this.sameSender = true;
            } else {
                this.log[mode][ref].push({
                    [sender.ref]: [data]
                });
            }
        } else {
            this.log[mode][ref].push({
                [sender.ref]: [data]
            });
        }
        console.log("this.log:", this.log);
    }

    async createMessageElements(mode, ref) {
        while (app.elements.chatWindow.firstChild) {
            app.elements.chatWindow.lastChild.remove();
        }
        console.log("this.log:", this.log);

        if (!this.log[mode][ref]) return;
        
        this.log[mode][ref].forEach(async (chatUserRef, tabIndex) => {
            console.log("chatUserRef:", chatUserRef);
            console.log("tabIndex:", tabIndex);
            for (const r of Object.keys(chatUserRef)) {
                console.log("r:", r);
                console.log("r.length:", r.length);
                let index = 0;
                for await (const data of chatUserRef[r]) {
                    console.log("data:", data);
                    console.log("index:", index);
                    if (index >= 1) {
                        await this.addToLastSection(data.message, data.chatUser.ref, tabIndex);
                    } else {
                        console.log("< 1");
                        await this.createNewSection(data.message, data.chatUser, tabIndex);
                    }
                    index++;
                };
            }
        });
    }

    async addToLastSection(message, ref, tabIndex) {
        console.log("addToLastSection");
        const lastChatMessageContainer = document.querySelector(`.chat_message-container[data-ref="${ref}"][tabIndex="${tabIndex}"]`);
        console.log("lastChatMessageContainer:", lastChatMessageContainer);
        const chatMessageBottomSection = lastChatMessageContainer.querySelector(".chat_message-bottom_section");
        console.log("chatMessageBottomSection:", chatMessageBottomSection);
        const chatMessage = message.createMessage();
        console.log("chatMessage:", chatMessage);
        chatMessageBottomSection.appendChild(chatMessage);
        const chatMessageDate = lastChatMessageContainer.querySelector(".chat_message_date");
        chatMessageDate.innerText = message.date.substring(0, message.date.length - 3);
    }

    async createNewSection(message, chatUser, tabIndex) {
        console.log("createNewSection");
        const chatMessageContainer = document.createElement("div");
        chatMessageContainer.classList.add("chat_message-container");
        chatMessageContainer.setAttribute("data-ref", chatUser.ref);
        chatMessageContainer.tabIndex = tabIndex;
        const chatMessageLeftSection = document.createElement("div");
        chatMessageLeftSection.classList.add("chat_message-left_section");
        const chatMessageUserAvatarWrapper = document.createElement("div");
        chatMessageUserAvatarWrapper.classList.add("chat_message_user_avatar-wrapper");
        chatMessageUserAvatarWrapper.style.setProperty("--bgcolor_pref", chatUser.avatar.bgcolor);
        const chatMessageUserProfileStatusWrapper = document.createElement("div");
        chatMessageUserProfileStatusWrapper.classList.add("chat_message_user_profile_status-wrapper");
        const chatMessageUserProfileStatus = document.createElement("div");
        chatMessageUserProfileStatus.classList.add("chat_message_user_profile_status");
        chatMessageUserProfileStatus.setAttribute("data-status", chatUser.status === "invisible" ? "offline" : chatUser.status);
        chatMessageUserProfileStatusWrapper.appendChild(chatMessageUserProfileStatus);
        const chatMessageUserAvatar = document.createElement("img");
        chatMessageUserAvatar.classList.add("chat_message_user_avatar");
        chatMessageUserAvatar.src = `./public/img/${chatUser.avatar.image}`;
        chatMessageUserAvatarWrapper.append(chatMessageUserAvatar, chatMessageUserProfileStatusWrapper);
        chatMessageLeftSection.appendChild(chatMessageUserAvatarWrapper);
        const chatMessageMainSection = document.createElement("div");
        chatMessageMainSection.classList.add("chat_message-main_section");
        const chatMessageTopSection = document.createElement("div");
        chatMessageTopSection.classList.add("chat_message-top_section");
        const chatMessageUserName = document.createElement("div");
        chatMessageUserName.classList.add("chat_message_user_name");
        chatMessageUserName.innerText = chatUser.name;
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
        app.elements.chatWindow.appendChild(chatMessageContainer);
    }
}