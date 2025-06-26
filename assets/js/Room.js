class Room {
    name;
    visibility;
    usersList = [];
    onlineUsers = [];
    offlineUsers = [];
    nbOfUsers = 0;

    constructor(roomData) {
        this.name = roomData.name;
        this.visibility = roomData.visibility;
    }

    addUser(user) {
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
        const connectionStatusUserProfileStatusWrapper = document.createElement("div");
        connectionStatusUserProfileStatusWrapper.classList.add("connection_status_user_profile_status-wrapper");
        const connectionStatusUserProfileStatus = document.createElement("div");
        connectionStatusUserProfileStatus.classList.add("connection_status_user_profile_status");
        connectionStatusUserProfileStatus.setAttribute("data-status", user.status === "invisible" ? "offline" : user.status);
        connectionStatusUserProfileStatusWrapper.appendChild(connectionStatusUserProfileStatus);
        const connectionStatusUserAvatar = document.createElement("img");
        connectionStatusUserAvatar.classList.add("connection_status_user_avatar");
        connectionStatusUserAvatar.src = `./assets/img/${user.avatar.image}`;
        connectionStatusUserAvatarWrapper.append(connectionStatusUserAvatar, connectionStatusUserProfileStatusWrapper);
        const connectionStatusUserName = document.createElement("div");
        connectionStatusUserName.classList.add("connection_status_user_name");
        connectionStatusUserName.style.setProperty("--color_pref", user.color);
        connectionStatusUserName.innerText = user.name;
        connectionStatusUserContainer.append(connectionStatusUserAvatarWrapper, connectionStatusUserName);

        connectionStatusUserContainer.addEventListener("click", connectionStatusUserContainerButtonsActivation);

        function connectionStatusUserContainerButtonsActivation(event) {
            document.querySelectorAll(".connection_status_user-container").forEach(button => button.classList.remove("active"));
            event.currentTarget.classList.add("active");
        }

        return connectionStatusUserContainer;
    }

}