class Room {
    name;
    visibility;
    usersList = [];
    onlineUsers = [];
    offlineUsers = [];
    nbOfUsers = 0;
    privateMessages;

    constructor(roomData, privateMessages) {
        this.name = roomData.name.replaceAll(" ", "-");
        this.visibility = roomData.visibility;
        this.privateMessages = privateMessages;
    }

    addUpdateUser(user) {
        const userAlreadyPresent = this.usersList.find(u => u.name === user.name);
        if (typeof userAlreadyPresent === "undefined") {
            this.usersList.push(user);
            if (user.status === "online" ||
                user.status === "busy" ||
                user.status === "sleep"
            ) {
                this.onlineUsers.push(user.name);
                this.onlineUsers.sort();
            } else {
                this.offlineUsers.push(user.name);
                this.offlineUsers.sort();
            }
        }
        console.log("addUser this.usersList:", this.usersList);

        // socket.emit('room-users', this.name);
        
        if (document.querySelector("main").dataset.view === "rooms") this.updateConnectionStatusSection();
    }

    removeUser(user) {
        let indexOfUser = this.usersList.indexOf(user);
        if (indexOfUser > 0) this.usersList.splice(indexOfUser, 1);
        if (this.onlineUsers.includes(user.name)) {
            this.onlineUsers.splice(this.onlineUsers.indexOf(user.name), 1);
        }
        if (this.offlineUsers.includes(user.name)) {
            this.offlineUsers.splice(this.offlineUsers.indexOf(user.name), 1);
        }
        if (document.querySelector("main").dataset.view === "rooms") this.updateConnectionStatusSection();
    }

    updateUsersList(users) {
        this.usersList = users;
        this.onlineUsers.length = 0;
        this.offlineUsers.length = 0;

        this.usersList.forEach(user => {
            if (user.status === "online" ||
                user.status === "busy" ||
                user.status === "sleep"
            ) {
                this.onlineUsers.push(user.name);
                this.onlineUsers.sort();
            } else {
                this.offlineUsers.push(user.name);
                this.offlineUsers.sort();
            }
        });
        console.log("addUser this.usersList:", this.usersList);

        if (document.querySelector("main").dataset.view === "rooms") this.updateConnectionStatusSection();
    }

    updateConnectionStatusSection() {
        const onlineStatusUsersContainer = document.querySelector(".online_status_users-container");
        const offlineStatusUsersContainer = document.querySelector(".offline_status_users-container");

        while (onlineStatusUsersContainer.firstChild) {
            onlineStatusUsersContainer.lastChild.remove();
        }
        while (offlineStatusUsersContainer.firstChild) {
            offlineStatusUsersContainer.lastChild.remove();
        }

        this.onlineUsers.forEach(userName => {
            const userToAdd = this.usersList.find(u => u.name === userName);
            const connectionStatusUserContainer = this.createConnectionStatusUser(userToAdd);
            onlineStatusUsersContainer.appendChild(connectionStatusUserContainer);
        });
        this.offlineUsers.forEach(userName => {
            const userToAdd = this.usersList.find(u => u.name === userName);
            const connectionStatusUserContainer = this.createConnectionStatusUser(userToAdd);
            offlineStatusUsersContainer.appendChild(connectionStatusUserContainer);
        });
        document.getElementById("online_users_number").innerText = this.onlineUsers.length;
        document.getElementById("offline_users_number").innerText = this.offlineUsers.length;
    }

    createConnectionStatusUser(user) {
        console.log("createConnectionStatusUser user:", user);        
        const connectionStatusUserContainer = document.createElement("div");
        connectionStatusUserContainer.classList.add("connection_status_user-container");
        connectionStatusUserContainer.tabIndex = -1;
        const connectionStatusUserAvatarWrapper = document.createElement("div");
        connectionStatusUserAvatarWrapper.classList.add("connection_status_user_avatar-wrapper");
        connectionStatusUserAvatarWrapper.style.setProperty("--bgcolor_pref", user.avatar.bgcolor);
        const connectionStatusUserProfileStatusLogoWrapper = document.createElement("div");
        connectionStatusUserProfileStatusLogoWrapper.classList.add("connection_status_user_profile_status_logo-wrapper");
        const connectionStatusUserProfileStatusLogo = document.createElement("div");
        connectionStatusUserProfileStatusLogo.classList.add("connection_status_user_profile_status_logo");
        connectionStatusUserProfileStatusLogo.setAttribute("data-status", user.status === "invisible" ? "offline" : user.status);
        connectionStatusUserProfileStatusLogoWrapper.appendChild(connectionStatusUserProfileStatusLogo);
        const connectionStatusUserAvatar = document.createElement("img");
        connectionStatusUserAvatar.classList.add("connection_status_user_avatar");
        connectionStatusUserAvatar.src = `./assets/img/${user.avatar.image}`;
        connectionStatusUserAvatarWrapper.append(connectionStatusUserAvatar, connectionStatusUserProfileStatusLogoWrapper);
        const connectionStatusUserName = document.createElement("div");
        connectionStatusUserName.classList.add("connection_status_user_name");
        connectionStatusUserName.style.setProperty("--color_pref", user.color);
        connectionStatusUserName.innerText = user.name;
        connectionStatusUserContainer.append(connectionStatusUserAvatarWrapper, connectionStatusUserName);

        connectionStatusUserContainer.addEventListener("click", connectionStatusUserContainerButtonsActivation.bind(this));

        function connectionStatusUserContainerButtonsActivation(event) {
            document.querySelectorAll(".connection_status_user-container").forEach(button => button.classList.remove("active"));
            event.currentTarget.classList.add("active");
            console.log("this.privateMessages:", this.privateMessages);            
            this.privateMessages.activeRemoteChatUser = user;
            user.showProfile();
            document.querySelector(".chat_room_avatar-wrapper").style.setProperty("--bgcolor_pref", user.avatar.bgcolor);
            document.querySelector(".chat_room_avatar").src = `./assets/img/${user.avatar.image}`;
            document.querySelector(".chat_room_profile_status").dataset.status = user.status;
            document.querySelector(".chat_room_name").textContent = user.name;
            if (document.querySelector(".chat_room_name-container").classList.contains("hide"))
                document.querySelector(".chat_room_name-container").classList.remove("hide");
            if (document.querySelector(".chat_message_to_send-container").classList.contains("hide"))
                document.querySelector(".chat_message_to_send-container").classList.remove("hide");
            while (document.querySelector(".chat_window").firstChild) {
                document.querySelector(".chat_window").lastChild.remove();
            }
            document.getElementById("message_to_send").value = "";
        }

        return connectionStatusUserContainer;
    }

}