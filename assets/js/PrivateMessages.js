class PrivateMessages {
    chatUsersList = [];
    activeRemoteChatUser = null;

    constructor() {
    }

    addChatUser(chatUser) {
        console.log("addChatUser:", chatUser);        
        let isAlreadyPresent = false;
        this.chatUsersList.forEach(c => {
            if (c.ref === chatUser.ref) isAlreadyPresent = true
        })
        if (!isAlreadyPresent) this.chatUsersList.push(chatUser);
        console.log("addChatUser chatUsersList:", this.chatUsersList);        
        this.showChatUsers();
    }

    removeChatUser(chatUserRef) {
        this.chatUsersList.forEach((c, index) => {
            if (c.ref === chatUserRef) this.chatUsersList.slice(index, 1);
        });
        this.showChatUsers();
    }

    getChatUsers(){
        return this.chatUsersList;
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
            const userPrivateProfileStatusLogoWrapper = document.createElement("div");
            userPrivateProfileStatusLogoWrapper.classList.add("user_private_profile_status_logo-wrapper");
            const userPrivateProfileStatusLogo = document.createElement("div");
            userPrivateProfileStatusLogo.classList.add("user_private_profile_status_logo");
            userPrivateProfileStatusLogo.setAttribute("data-status", chatUser.status === "invisible" ? "offline" : chatUser.status);
            userPrivateProfileStatusLogoWrapper.appendChild(userPrivateProfileStatusLogo);
            const userPrivateAvatar = document.createElement("img");
            userPrivateAvatar.classList.add("user_private_avatar");
            userPrivateAvatar.src = `./assets/img/${chatUser.avatar.image}`;
            userPrivateAvatarWrapper.append(userPrivateAvatar, userPrivateProfileStatusLogoWrapper);
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
                // chatUser.showProfile();
                this.showUserPrivateChatDetails(chatUser);
            });
        });
    }

    showUserPrivateChatDetails(chatUser) {
        console.log("showUserPrivateChatDetails chatUser:", chatUser);        
        app.chat.peer = chatUser;
        app.elements.chatRoomAvatarWrapper.style.setProperty("--bgcolor_pref", chatUser.avatar.bgcolor);
        app.elements.chatRoomAvatar.src = `./assets/img/${chatUser.avatar.image}`;
        app.elements.chatRoomProfileStatus.dataset.status = chatUser.status;
        app.elements.chatRoomName.textContent = chatUser.name;
        app.elements.chatRoomName.dataset.name = chatUser.username;
        if (app.elements.chatRoomNameContainer.classList.contains("hide"))
            app.elements.chatRoomNameContainer.classList.remove("hide");
        if (app.elements.chatMessageToSendContainer.classList.contains("hide"))
            app.elements.chatMessageToSendContainer.classList.remove("hide");
        while (app.elements.chatWindow.firstChild) {
            app.elements.chatWindow.lastChild.remove();
        }
        app.elements.messageToSend.value = "";

        showUserPrivateProfile();

        function showUserPrivateProfile() {
            console.log("showUserPrivateProfile");
            document.querySelector(".chat_user_profile_panel").style.setProperty("--bgcolor_pref", chatUser.avatar.bgcolor);
            document.querySelector(".chat_user_profile_avatar").src = `./assets/img/${chatUser.avatar.image}`;
            document.querySelector(".chat_user_profile_status_logo").dataset.status = chatUser.status === "invisible" ? "offline" : chatUser.status;
            document.querySelector(".chat_user_profile_name").textContent = chatUser.name;
            document.querySelector(".chat_user_profile_username").textContent = chatUser.username;
            document.querySelector(".chat_user_profile_details_about_me_content").textContent = chatUser.aboutme;
            document.querySelector(".chat_user_profile_details_member_since_content").textContent = chatUser.membersince;
            if (document.querySelector(".chat_user_profile_panel").classList.contains("hide"))
                document.querySelector(".chat_user_profile_panel").classList.remove("hide");
        }
    }
}