class App {
    localUser;
    serversList = [];
    elements = {
        main: document.querySelector("main"),
        sidebarButtons: document.querySelectorAll(".sidebar_button"),
        showPrivateMessages: document.querySelector(".show_private_messages-container"),
        servers: document.querySelectorAll(".server-container"),
        features: document.querySelectorAll(".feature")    }
    chat;
    privateMessages;

    constructor(localUser, chat) {
        this.localUser = localUser;
        this.chat = chat;
        this.events();
    }

    events() {
        this.elements.features.forEach(feature => feature.addEventListener("click", this.selectFeature.bind(this)));
        this.elements.showPrivateMessages.addEventListener("click", this.showPrivateMessages.bind(this));
    }

    showPrivateMessages() {
        console.log("showPrivateMessages");
        this.elements.sidebarButtons.forEach(button => button.classList.remove("active"));
        this.elements.showPrivateMessages.classList.add("active");
        document.querySelector("main").dataset.view = "chatuser";
        document.querySelector(".chat_title").textContent = "Messages privés";
        document.querySelector(".chat_room_name-container").classList.add("hide");
        document.querySelector(".chat_user_profile_panel").classList.add("hide");
        document.querySelector(".chat_message_to_send-container").classList.add("hide");
        while (this.chat.chatWindow.firstChild) {
            this.chat.chatWindow.lastChild.remove();
        }
        this.chat.messageToSend.value = "";
        this.privateMessages.showChatUsers();
    }

    showServer(event) {
        const serverName = event.currentTarget.dataset.name;
        console.log("serverName:", serverName);
        this.elements.sidebarButtons.forEach(button => button.classList.remove("active"));
        event.currentTarget.classList.add("active");
        document.querySelector("main").dataset.view = "rooms";
        document.querySelector(".chat_title").textContent = serverName;
        document.querySelector(".chat_room_name-container").classList.add("hide");
        while (this.chat.chatWindow.firstChild) {
            this.chat.chatWindow.lastChild.remove();
        }
        this.chat.messageToSend.value = "";
        const serverToShow = this.serversList.find(server => {
            console.log("server.name:", server.name);
            return server.name === serverName;
        });
        console.log("serverToShow:", serverToShow);

        serverToShow.showRooms();
    }

    setChat(chat) {
        this.chat = chat;
    }

    setPrivateMessages(privateMessages) {
        this.privateMessages = privateMessages;
    }

    setLocalUser(user) {
        this.localUser = user;
        console.log("setLocalUser this.localUser:", this.localUser);        
        document.querySelector(".local_user_avatar-wrapper").style.setProperty("--bgcolor_pref", this.localUser.avatar.bgcolor);
        document.querySelector(".local_user_avatar").src = `./assets/img/${this.localUser.avatar.image}`;
        document.querySelector(".local_user_status_logo").dataset.status = this.localUser.status;
        document.querySelector(".local_user_name_display").textContent = this.localUser.name;
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
        document.querySelector(".local_user_status_display").textContent = status;
        document.querySelector(".local_user_profile_settings-container").style.setProperty("--bgcolor_pref", this.localUser.avatar.bgcolor);
        document.querySelector(".local_user_name_status_display-container").addEventListener("click", showLocalUserProfile);
        document.querySelector(".local_user_avatar-wrapper").addEventListener("click", showLocalUserProfile.bind(this));
        
        function showLocalUserProfile() {
            document.querySelector(".local_user_profile_panel").classList.toggle("d-none");
            if (!document.querySelector(".local_user_profile_panel").classList.contains("d-none")) {
                document.querySelector(".local_user_profile_settings-container").dataset.status = this.localUser.status;
                document.querySelector(".local_user_avatar").src = `./assets/img/${this.localUser.avatar.image}`;
                document.querySelector(".local_user_profile_name").textContent = this.localUser.name;
                document.querySelector(".local_user_profile_username").textContent = this.localUser.username;
                document.querySelector(".local_user_profile_select_status_title").textContent = status;
            }
        }
        
        document.querySelector(".local_user_mic").addEventListener("click", micOnOff);
        document.querySelector(".local_user_headphones").addEventListener("click", soundOnOff);

        function micOnOff() {
            switch (document.querySelector(".local_user_options-container").dataset.mic) {
                case "off":
                    document.querySelector(".local_user_options-container").dataset.mic = "on";
                    break;
                case "on":
                    document.querySelector(".local_user_options-container").dataset.mic = "off";
                    break;
            }
        }

        function soundOnOff() {
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

    getChat() {
        return this.chat;
    }

    getPrivateMessages() {
        return this.privateMessages;
    }

    getLocalUser() {
        return this.localUser;
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
        this.elements.sidebarButtons = document.querySelectorAll(".sidebar_button");
        this.elements.servers = document.querySelectorAll(".server-container");
        this.elements.servers.forEach((button) => {
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


}