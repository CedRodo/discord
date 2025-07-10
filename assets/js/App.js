class App {
    localUser;
    usersList = [];
    serversList = [];
    chat;
    privateMessages;

    constructor() {
        this.currentServer = null;
        this.mode = "";
        this.elements = new Element().getAppElements();
        this.privateMessages = new PrivateMessages();
        this.chat = new Chat();
        this.events();
    }

    events() {
        this.getElements().features.forEach(feature => feature.addEventListener("click", this.selectFeature.bind(this)));
        this.getElements().showPrivateMessages.addEventListener("click", this.showPrivateMessages.bind(this));
        document.querySelector(".server_details-container").addEventListener("click", () => {
            document.querySelector(".server_details-container").classList.toggle("dropdown");
        });
        this.getElements().messageToSend.addEventListener("input", event => {
            this.chat.message.content = event.target.value;
            console.log("input this.chat.message.content:", this.chat.message.content);
        });
        this.getElements().messageToSend.addEventListener("keyup", (event) => {
            // if (event.key === "Enter" && this.privateMessages.activeRemoteChatUser) {
            if (event.key === "Enter") {
                // if (event.currentTarget.value === "\n"){
                //     event.currentTarget.value.replace("\n", "");
                //     console.log("substring:", event.currentTarget.value);                    
                // }
                console.log("event.currentTarget.value:", event.currentTarget.value);
                console.log("this.chat.message.content:", this.chat.message.content);
                if (this.chat.message.content === "") {
                    console.log("this.chat.message.content === ''");
                    return;
                }

                const name = this.getElements().chatRoomName.dataset.name;

                console.log("this.chat.message:", this.chat.message);
                if (this.mode === "rooms") {
                    const room = this.localUser.getRooms().find(r => r.name === name);
                    console.log("room:", room);
                    this.chat.peer = room;                 
                }
                if (this.mode === "chatuser") {
                    const user = this.getUsers().find(u => u.username === name);
                    console.log("user:", user);                    
                }
                socket.emit('send-chat-message', this.chat.message, this.chat.peer, this.mode);

                this.chat.message.content = "";
                event.currentTarget.value = "";
            }
        });
        // this.getElements().chatUserProfileAdd.addEventListener("click", this.addUserPrivate.bind(this));
        this.getElements().chatUserProfileAdd.addEventListener("click", this.addUserPrivate.bind(this));
        this.getElements().localUserProfileStatusSelections.forEach(selection => {
            selection.addEventListener("click", this.selectStatus.bind(this));
        });

        document.querySelector(".local_user_name_status_display-container").addEventListener("click", this.showLocalUserProfile.bind(this));
        document.querySelector(".local_user_avatar-wrapper").addEventListener("click", this.showLocalUserProfile.bind(this));

        document.querySelector(".local_user_mic").addEventListener("click", this.micOnOff.bind(this));
        document.querySelector(".local_user_headphones").addEventListener("click", this.soundOnOff.bind(this));
    }

    selectStatus(event) {
        console.log("selectStatus evvent:", event.currentTarget);
        const status = event.currentTarget.dataset.selection;
        console.log("status:", status);
        this.localUser.status = status;
        this.localUser.chatUser.status = status;

        socket.emit('update-local-user', this.localUser);

        this.updateUserInRooms();

        this.setlocalUserProfileDetails();        
    }

    updateUserInRooms() {
        console.log("updateUserInRooms this.localUser.getRooms():", this.localUser.getRooms());
        
        this.localUser.getRooms().forEach(room => {
            room.usersList.forEach(u => {
                if (u.ref === this.localUser.ref) {
                    console.log("updateUserInRooms u:", u);
                    console.log("updateUserInRooms this.localUser:", this.localUser);
                    for (const prop in u) {
                        if (u[prop] !== this.localUser[prop]) {
                            u[prop] = this.localUser[prop];
                        }
                    }
                    u = this.localUser;
                    console.log("updateUserInRooms u => this.localUser:", u);
                    socket.emit('room-users', room.name, "");
                }
            });
            console.log("updateUserInRooms room:", room);
        });
        if (document.querySelector("main").dataset.view === "rooms") {
            if (this.getCurrentServer()) {
                if (this.getCurrentServer().getCurrentRoom()) {
                    this.getCurrentServer().getCurrentRoom().updateConnectionStatusSection();
                }
            }
        };

    }

    showPrivateMessages() {
        console.log("showPrivateMessages");
        this.getElements().sidebarButtons.forEach(button => button.classList.remove("active"));
        this.getElements().showPrivateMessages.classList.add("active");
        document.querySelector("main").dataset.view = "chatuser";
        document.querySelector(".chat_title").textContent = "Messages privés";
        document.querySelector(".chat_room_name-container").classList.add("hide");
        document.querySelector(".chat_user_profile_panel").classList.add("hide");
        document.querySelector(".chat_message_to_send-container").classList.add("hide");
        while (this.getElements().chatWindow.firstChild) {
            this.getElements().chatWindow.lastChild.remove();
        }
        this.getElements().messageToSend.value = "";
        this.mode = "chatuser";
        this.privateMessages.showChatUsers();
    }

    showServer(event) {
        const serverName = event.currentTarget.dataset.name;
        console.log("serverName:", serverName);
        this.getElements().sidebarButtons.forEach(button => button.classList.remove("active"));
        event.currentTarget.classList.add("active");
        document.querySelector("main").dataset.view = "rooms";
        document.querySelector(".chat_title").textContent = serverName;
        document.querySelector(".chat_room_name-container").classList.add("hide");
        document.querySelector(".server_details_name").textContent = serverName;
        while (this.getElements().chatWindow.firstChild) {
            this.getElements().chatWindow.lastChild.remove();
        }
        this.getElements().messageToSend.value = "";
        const serverToShow = this.serversList.find(server => {
            console.log("server.name:", server.name);
            return server.name === serverName;
        });
        this.mode = "rooms";
        console.log("serverToShow:", serverToShow);
        this.setCurrentServer(serverToShow);
        serverToShow.showRooms();
    }

    setCurrentServer(server) {
        this.currentServer = server;
    }

    getCurrentServer() {
        return this.currentServer;
    }

    setLocalUser(user) {
        console.log("setLocalUser this.localUser:", this.localUser);        
        this.localUser = user;
        this.localChatUser = new ChatUser(this.localUser);

        this.setlocalUserProfileDetails();

    }

    setlocalUserProfileDetails() {
        document.querySelector(".local_user_avatar-wrapper").style.setProperty("--bgcolor_pref", this.localUser.avatar.bgcolor);
        document.querySelector(".local_user_avatar").src = `./assets/img/${this.localUser.avatar.image}`;
        document.querySelector(".local_user_status_logo").dataset.status = this.localUser.status;
        document.querySelector(".local_user_name_display").textContent = this.localUser.name;
        document.querySelector(".local_user_status_display .content").textContent = this.translateStatus().charAt(0).toUpperCase() + this.translateStatus().slice(1);
        document.querySelector(".local_user_status_display .content").setAttribute("data-username", this.localUser.username);
        document.querySelector(".local_user_profile_select_status_title").textContent = this.translateStatus();
        this.getElements().localUserProfileSettingsContainer.style.setProperty("--bgcolor_pref", this.localUser.avatar.bgcolor);
    }

    translateStatus() {
        let status = "";
        switch (this.localUser.status) {
            case "online":
                status = "en ligne";
                break;
            case "busy":
                status = "occupé";
                break;
            case "sleep":
                status = "inactif";
                break;
            case "invisible":
                status = "invisible";
                break;
        }
        return status;
    }
    
    getLocalUser() {
        return this.localUser;
    }

    getUsers() {
        return this.usersList;
    }

    setUsers(users) {
        this.usersList = users;
    }

    addUser(user) {
        const userAlreadyPresent = this.usersList.find(u => u.ref === user.ref);
        if (typeof userAlreadyPresent === "undefined") this.usersList.push(user);
    }

    getElements() {
        return this.elements;
    }

    getChat() {
        return this.chat;
    }

    getPrivateMessages() {
        return this.privateMessages;
    }

    addServer(server) {
        console.log("addServer server:", server);        
        const serverAlreadyPresent = this.serversList.find(s => s.name === server.name);
        if (typeof serverAlreadyPresent === "undefined") {
            console.log("add new server");            
            this.serversList.push(server);
        }
        this.updateServersSection();
    }
    updateServersSection() {
        const serversContainer = document.querySelector(".servers-container");
        while (serversContainer.firstChild) {
            serversContainer.lastChild.remove();
        }
        this.serversList.forEach(server => {
            const serverContainer = this.createServer(server);
            serversContainer.appendChild(serverContainer);
        });
        this.getElements().sidebarButtons = document.querySelectorAll(".sidebar_button");
        this.getElements().servers = document.querySelectorAll(".server-container");
        this.getElements().servers.forEach((button) => {
            button.addEventListener("click", this.showServer.bind(this));
        });
    }

    createServer(server) {
        console.log("createServer server:", server);
        const serverContainer = document.createElement("div");
        serverContainer.classList.add("server-container", "sidebar_button");
        serverContainer.tabIndex = -1;
        serverContainer.title = server.name;
        serverContainer.setAttribute("data-name", server.name);
        const serverAvatarWrapper = document.createElement("div");
        serverAvatarWrapper.classList.add("server_avatar-wrapper");
        serverAvatarWrapper.style.setProperty("--bgcolor_pref", server.avatar.bgcolor);
        const serverAvatar = document.createElement("img");
        serverAvatar.classList.add("server_avatar");
        serverAvatar.src = `./assets/img/${server.avatar.image}`;
        serverAvatarWrapper.appendChild(serverAvatar);
        serverContainer.append(serverAvatarWrapper);
        return serverContainer;
    }

    addUserPrivate(event) {
        console.log("addUserPrivate");
        const userRef = event.currentTarget.dataset.ref;
        console.log("addUserPrivate userRef:", userRef);
        console.log("addUserPrivate this.getUsers():", this.getUsers());
        console.log("addUserPrivate this:", this);
        const user = this.getUsers().find(u => u.ref === userRef);
        if (user) {
            console.log("addUserPrivate user:", user);
            this.getElements().sidebarButtons.forEach(button => button.classList.remove("active"));
            this.getElements().showPrivateMessages.classList.add("active");
            document.querySelector("main").dataset.view = "chatuser";
            document.querySelector(".chat_title").textContent = "Messages privés";
            document.querySelector(".chat_room_name-container").classList.add("hide");
            document.querySelector(".chat_user_profile_panel").classList.add("hide");
            document.querySelector(".chat_message_to_send-container").classList.add("hide");
            while (this.getElements().chatWindow.firstChild) {
                this.getElements().chatWindow.lastChild.remove();
            }
            this.getElements().messageToSend.value = "";

            this.mode = "chatuser";
            this.privateMessages.addChatUser(user.chatUser);
            socket.emit('join-user', user.username);
        }
    }

    addUserPrivateNotification(user) {
        console.log("addUserPrivateNotification user:", user);        
        if (!document.querySelector(`.show_private_messages-container[data-username="${user.username}"]`)) {
            const showLastChatContainer = document.createElement("div");
            showLastChatContainer.classList.add("show_last_chat-container", "sidebar_button");
            showLastChatContainer.setAttribute("data-username", user.username);
            showLastChatContainer.title = user.name;
            const showLastChatAvatarWrapper = document.createElement("div");
            showLastChatAvatarWrapper.classList.add("show_last_chat_avatar-wrapper");
            showLastChatAvatarWrapper.style.setProperty("--bgcolor_pref", user.avatar.bgcolor);
            const showLastChatAvatar = document.createElement("img");
            showLastChatAvatar.classList.add("show_last_chat_avatar");
            showLastChatAvatar.src = `./assets/img/${user.avatar.image}`;
            showLastChatAvatarWrapper.appendChild(showLastChatAvatar);
            showLastChatContainer.appendChild(showLastChatAvatarWrapper);
            document.querySelector(".private_messages_last_chat-container").appendChild(showLastChatContainer);

            showLastChatContainer.addEventListener("click", showUserPrivateMessage.bind(this));

            function showUserPrivateMessage() {
                console.log("showUserPrivateMessage user:", user);
                document.querySelector("main").dataset.view = "chatuser";
                document.querySelector(".chat_title").textContent = "Messages privés";
                document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));
                // event.currentTarget.classList.add("active");
                this.privateMessages.activeRemoteChatUser = user;
                // chatUser.showProfile();
                this.mode = "chatuser";
                this.privateMessages.showUserPrivateChatDetails(user);
                showLastChatContainer.removeEventListener("click", showUserPrivateMessage);
                showLastChatContainer.remove();
                socket.emit('join-user', user.username);
            }
        }
    }

    selectFeature(event) {
        document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));
        event.currentTarget.classList.add("active");
        document.querySelector(".chat_room_avatar-wrapper").style.setProperty("--bgcolor_pref", "transparent");
        document.querySelector(".chat_room_avatar").src = "";
        document.querySelector(".chat_room_profile_status_logo").dataset.status = "";
        document.querySelector(".chat_room_name").textContent = "";
        document.querySelector(".chat_room_name-container").classList.add("hide");
        document.querySelector(".chat_user_profile_panel").classList.add("hide");
    }

    showLocalUserProfile() {
        console.log("showLocalUserProfile localUser:", this.localUser);
        document.querySelector(".local_user_profile_panel").classList.toggle("d-none");
        if (!document.querySelector(".local_user_profile_panel").classList.contains("d-none")) {
            this.getElements().localUserProfileSettingsContainer.dataset.status = this.localUser.status;
            document.querySelector(".local_user_avatar").src = `./assets/img/${this.localUser.avatar.image}`;
            document.querySelector(".local_user_profile_name").textContent = this.localUser.name;
            document.querySelector(".local_user_profile_username").textContent = this.localUser.username;
            document.querySelector(".local_user_profile_select_status_title").textContent = this.translateStatus();
        }
    }

    micOnOff() {
        switch (document.querySelector(".local_user_options-container").dataset.mic) {
            case "off":
                document.querySelector(".local_user_options-container").dataset.mic = "on";
                break;
            case "on":
                document.querySelector(".local_user_options-container").dataset.mic = "off";
                break;
        }
    }

    soundOnOff() {
        switch (document.querySelector(".local_user_options-container").dataset.sound) {
            case "off":
                document.querySelector(".local_user_options-container").dataset.sound = "on";
                break;
            case "on":
                document.querySelector(".local_user_options-container").dataset.sound = "off";
                break;
        }
    }


}