class App {
    serversList = [];
    features;
    constructor() {
        this.features = document.querySelectorAll(".feature");
        this.features.forEach(feature => feature.addEventListener("click", this.selectFeature.bind(this)));
    }
    setLocalUser(user) {
        document.querySelector(".local_user_avatar-wrapper").style.setProperty("--bgcolor_pref", user.avatar.bgcolor);
        document.querySelector(".local_user_avatar").src = `./assets/img/${user.avatar.image}`;
        document.querySelector(".local_user_status_logo").dataset.status = user.status;
        document.querySelector(".local_user_name_display").textContent = user.name;
        let status = "";
        switch (user.status) {
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
        document.querySelector(".local_user_profile_settings-container").style.setProperty("--bgcolor_pref", user.avatar.bgcolor);
        document.querySelector(".local_user_name_status_display-container").addEventListener("click", showLocalUserProfile);
        document.querySelector(".local_user_avatar-wrapper").addEventListener("click", showLocalUserProfile);
        
        function showLocalUserProfile() {        
            document.querySelector(".local_user_profile_panel").classList.toggle("d-none");
            if (!document.querySelector(".local_user_profile_panel").classList.contains("d-none")) {
                document.querySelector(".local_user_profile_settings-container").dataset.status = user.status;
                document.querySelector(".local_user_avatar").src = `./assets/img/${user.avatar.image}`;
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