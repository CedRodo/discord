class PrivateMessages {
    chatUsersList = [];
    activeRemoteChatUser = null;
    constructor() {
    }
    addChatUser(chatUser) {
        let isAlreadyPresent = false;
        this.chatUsersList.forEach(c => {
            if (c.ref === chatUser.ref) isAlreadyPresent = true
        })
        if (!isAlreadyPresent) this.chatUsersList.push(chatUser);
        this.showChatUsers();
    }
    removeChatUser(chatUserRef) {
        this.chatUsersList.forEach((c, index) => {
            if (c.ref === chatUserRef) this.chatUsersList.slice(index, 1);
        });
        this.showChatUsers();
    }
    showChatUsers() {
        const usersPrivateContainer = document.querySelector(".users_private-container");
        while (usersPrivateContainer.firstChild) {
            usersPrivateContainer.lastChild.remove();
        }
        this.chatUsersList.forEach((chatUser, index) => {
            const userPrivateContainer = document.createElement("div");
            userPrivateContainer.classList.add("user_private-container", "left_panel_button");
            userPrivateContainer.setAttribute("data-ref", chatUser.ref);
            // userPrivateContainer.setAttribute("data-status", chatUser.status);
            userPrivateContainer.setAttribute("aria-selected", "false");
            userPrivateContainer.tabIndex = index === 0 ? 0 : -1;
            const userPrivateAvatarWrapper = document.createElement("div");
            userPrivateAvatarWrapper.classList.add("user_private_avatar-wrapper");
            userPrivateAvatarWrapper.style.setProperty("--bgcolor_pref", chatUser.avatar.bgcolor);
            const userPrivateProfileStatusWrapper = document.createElement("div");
            userPrivateProfileStatusWrapper.classList.add("user_private_profile_status-wrapper");
            const userPrivateProfileStatus = document.createElement("div");
            userPrivateProfileStatus.classList.add("user_private_profile_status");
            userPrivateProfileStatus.setAttribute("data-status", chatUser.status === "notvisible" ? "offline" : chatUser.status);
            userPrivateProfileStatusWrapper.appendChild(userPrivateProfileStatus);
            const userPrivateAvatar = document.createElement("img");
            userPrivateAvatar.classList.add("user_private_avatar");
            userPrivateAvatar.src = `./assets/img/${chatUser.avatar.image}`;
            userPrivateAvatarWrapper.append(userPrivateAvatar, userPrivateProfileStatusWrapper);
            const userPrivateName = document.createElement("div");
            userPrivateName.classList.add("user_private_name");
            userPrivateName.style.setProperty("--color_pref", chatUser.color);
            userPrivateName.innerText = chatUser.name;
            userPrivateContainer.append(userPrivateAvatarWrapper, userPrivateName);
            usersPrivateContainer.appendChild(userPrivateContainer);

            document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));

            userPrivateContainer.addEventListener("click", event => {
                document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));
                event.currentTarget.classList.add("active");
                this.activeRemoteChatUser = chatUser;
                chatUser.showProfile();
                document.querySelector(".chat_room_avatar-wrapper").style.setProperty("--bgcolor_pref", chatUser.avatar.bgcolor);
                document.querySelector(".chat_room_avatar").src = `./assets/img/${chatUser.avatar.image}`;
                document.querySelector(".chat_room_profile_status").dataset.status = chatUser.status;
                document.querySelector(".chat_room_name").textContent = chatUser.name;
                if (document.querySelector(".chat_room_name-container").classList.contains("hide"))
                    document.querySelector(".chat_room_name-container").classList.remove("hide");
                if (document.querySelector(".chat_message_to_send-container").classList.contains("hide"))
                    document.querySelector(".chat_message_to_send-container").classList.remove("hide");
            });
        });
    }
}