class Room {
    ref;
    name;
    visibility;
    usersList = [];
    nbOfUsers = 0;
    privateMessages;

    constructor(roomData, privateMessages) {
        this.ref = roomData.ref.replaceAll(" ", "-");
        this.name = roomData.name.replaceAll(" ", "-");
        this.visibility = roomData.visibility;
        this.privateMessages = privateMessages;
    }

    removeUser(user) {
        let indexOfUser = this.getUsers().indexOf(user);
        if (indexOfUser > 0) this.getUsers().splice(indexOfUser, 1);
        if (app.mode === "rooms") this.updateConnectionStatusSection();
    }

    getUsers() {
        return this.usersList;
    }

    setUsers(users) {
        this.usersList = users;
    }

    updateUserInUsersList(user) {
        this.getUsers().forEach(u => {
            if (user.ref === u.ref) {
                u = user;
            }
        });
        console.log("updateUserInUsersList this.getUsers():", this.getUsers());
        if (app.mode === "rooms") this.updateConnectionStatusSection();
    }

    updateUsersList(users) {
        this.setUsers(users);
        console.log("addUser this.getUsers():", this.getUsers());        
        if (app.mode === "rooms") this.updateConnectionStatusSection();
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
        
        let count = { online: 0, offline: 0 };
        let onlineStatuses = ["online", "busy", "sleep"];
        
        this.getUsers().forEach(user => {
            const connectionStatusUserContainer = this.createConnectionStatusUser(user);
            if (onlineStatuses.includes(user.status)) {
                onlineStatusUsersContainer.appendChild(connectionStatusUserContainer);
                count.online++;
            } else {
                offlineStatusUsersContainer.appendChild(connectionStatusUserContainer);
                count.offline++;
            }
        });

        document.getElementById("online_users_number").innerText = count.online;
        document.getElementById("offline_users_number").innerText = count.offline;
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

            console.log("connectionStatusUserContainerButtonsActivation user:", user);
            console.log("connectionStatusUserContainerButtonsActivation chatUser:", user.chatUser);

            document.querySelectorAll(".connection_status_user-container").forEach(button => button.classList.remove("active"));
            event.currentTarget.classList.add("active");

            this.showConnectionStatusUserProfile(user, connectionStatusUserContainer);
        }

        return connectionStatusUserContainer;
    }

    showConnectionStatusUserProfile(user, container) {
        console.log("showConnectionStatusUserProfile user:", user);   
        console.log("showConnectionStatusUserProfile container:", container);
        
        if (document.querySelector(".connection_status_user_aside_profile-container"))
            document.querySelector(".connection_status_user_aside_profile-container").remove();

        const connectionStatusUserAsideProfileContainer = document.createElement("div");
        connectionStatusUserAsideProfileContainer.classList.add("connection_status_user_aside_profile-container");
        connectionStatusUserAsideProfileContainer.style.setProperty("--bgcolor_pref", user.avatar.bgcolor);
        connectionStatusUserAsideProfileContainer.setAttribute("data-username", user.username);

        const connectionStatusUserAsideProfileTopSection = document.createElement("div");
        connectionStatusUserAsideProfileTopSection.classList.add("connection_status_user_aside_profile-top_section");
        const connectionStatusUserAsideProfileBottomSection = document.createElement("div");
        connectionStatusUserAsideProfileBottomSection.classList.add("connection_status_user_aside_profile-bottom_section");

        const connectionStatusUserAsideProfileFeaturesContainer = document.createElement("div");
        connectionStatusUserAsideProfileFeaturesContainer.classList.add("connection_status_user_aside_profile_features-container");
        const connectionStatusUserAsideProfileAdd = document.createElement("div");
        connectionStatusUserAsideProfileAdd.classList.add("connection_status_user_aside_profile_feature", "connection_status_user_aside_profile_add");
        connectionStatusUserAsideProfileAdd.setAttribute("data-ref", user.ref);
        const connectionStatusUserAsideProfileAddIcon = document.createElement("i");
        connectionStatusUserAsideProfileAddIcon.classList.add("fa-solid", "fa-user-plus");
        connectionStatusUserAsideProfileAdd.appendChild(connectionStatusUserAsideProfileAddIcon);
        const connectionStatusUserAsideProfilePlus = document.createElement("div");
        connectionStatusUserAsideProfilePlus.classList.add("connection_status_user_aside_profile_feature", "connection_status_user_aside_profile_plus");
        const connectionStatusUserAsideProfilePlusIcon = document.createElement("i");
        connectionStatusUserAsideProfilePlusIcon.classList.add("fa-solid", "fa-ellipsis");
        connectionStatusUserAsideProfilePlus.appendChild(connectionStatusUserAsideProfilePlusIcon);
        connectionStatusUserAsideProfileFeaturesContainer.append(connectionStatusUserAsideProfileAdd, connectionStatusUserAsideProfilePlus);

        const connectionStatusUserAsideProfileAvatarContainer = document.createElement("div");
        connectionStatusUserAsideProfileAvatarContainer.classList.add("connection_status_user_aside_profile_avatar-container");
        const connectionStatusUserAsideProfileAvatarWrapper = document.createElement("div");
        connectionStatusUserAsideProfileAvatarWrapper.classList.add("connection_status_user_aside_profile_avatar-wrapper");
        const connectionStatusUserAsideProfileAvatar = document.createElement("img");
        connectionStatusUserAsideProfileAvatar.classList.add("connection_status_user_aside_profile_avatar");
        connectionStatusUserAsideProfileAvatar.src = `./assets/img/${user.avatar.image}`;
        connectionStatusUserAsideProfileAvatarWrapper.appendChild(connectionStatusUserAsideProfileAvatar);
        const connectionStatusUserAsideProfileStatusLogoWrapper = document.createElement("div");
        connectionStatusUserAsideProfileStatusLogoWrapper.classList.add("connection_status_user_aside_profile_status_logo-wrapper");
        const connectionStatusUserAsideProfileStatusLogo = document.createElement("div");
        connectionStatusUserAsideProfileStatusLogo.classList.add("connection_status_user_aside_profile_status_logo");
        connectionStatusUserAsideProfileStatusLogo.setAttribute("data-status", user.status === "invisible" ? "offline" : user.status);
        connectionStatusUserAsideProfileStatusLogoWrapper.appendChild(connectionStatusUserAsideProfileStatusLogo);
        connectionStatusUserAsideProfileAvatarContainer.append(connectionStatusUserAsideProfileAvatarWrapper, connectionStatusUserAsideProfileStatusLogoWrapper);
        
        const connectionStatusUserAsideProfileNameUsernameContainer = document.createElement("div");
        connectionStatusUserAsideProfileNameUsernameContainer.classList.add("connection_status_user_aside_profile_name_username-container");
        const connectionStatusUserAsideProfileNameContainer = document.createElement("div");
        connectionStatusUserAsideProfileNameContainer.classList.add("connection_status_user_aside_profile_name-container");
        const connectionStatusUserAsideProfileName = document.createElement("div");
        connectionStatusUserAsideProfileName.classList.add("connection_status_user_aside_profile_name");
        connectionStatusUserAsideProfileName.innerText = user.name;
        connectionStatusUserAsideProfileNameContainer.appendChild(connectionStatusUserAsideProfileName);
        const connectionStatusUserAsideProfileUsernameContainer = document.createElement("div");
        connectionStatusUserAsideProfileUsernameContainer.classList.add("connection_status_user_aside_profile_username-container");
        const connectionStatusUserAsideProfileUsername = document.createElement("div");
        connectionStatusUserAsideProfileUsername.classList.add("connection_status_user_aside_profile_username");
        connectionStatusUserAsideProfileUsername.innerText = user.username;
        connectionStatusUserAsideProfileUsernameContainer.appendChild(connectionStatusUserAsideProfileUsername);        
        connectionStatusUserAsideProfileNameUsernameContainer.append(connectionStatusUserAsideProfileNameContainer, connectionStatusUserAsideProfileUsernameContainer);

        const connectionStatusUserAsideProfileInCommonServersContainer = document.createElement("div");
        connectionStatusUserAsideProfileInCommonServersContainer.classList.add("connection_status_user_aside_profile_in_common_servers-container");
        const connectionStatusUserAsideProfileInCommonServersLogoWrapper = document.createElement("div");
        connectionStatusUserAsideProfileInCommonServersLogoWrapper.classList.add("connection_status_user_aside_profile_in_common_servers_logo-wrapper");
        const connectionStatusUserAsideProfileInCommonServersLogo = document.createElement("img");
        connectionStatusUserAsideProfileInCommonServersLogo.classList.add("connection_status_user_aside_profile_in_common_servers_logo");
        connectionStatusUserAsideProfileInCommonServersLogo.src = `./assets/img/${user.avatar.image}`;
        connectionStatusUserAsideProfileInCommonServersLogoWrapper.appendChild(connectionStatusUserAsideProfileInCommonServersLogo);
        const connectionStatusUserAsideProfileInCommonServersTextContainer = document.createElement("div");
        connectionStatusUserAsideProfileInCommonServersTextContainer.classList.add("connection_status_user_aside_profile_in_common_servers_text-container");
        const connectionStatusUserAsideProfileInCommonServersNumber = document.createElement("span");
        connectionStatusUserAsideProfileInCommonServersNumber.classList.add("connection_status_user_aside_profile_in_common_servers_number");
        connectionStatusUserAsideProfileInCommonServersNumber.textContent = 1;
        const connectionStatusUserAsideProfileInCommonServersSeparator = document.createElement("span");
        connectionStatusUserAsideProfileInCommonServersSeparator.classList.add("connection_status_user_aside_profile_in_common_servers_separator");
        connectionStatusUserAsideProfileInCommonServersSeparator.textContent = " ";
        const connectionStatusUserAsideProfileInCommonServersText = document.createElement("span");
        connectionStatusUserAsideProfileInCommonServersText.classList.add("connection_status_user_aside_profile_in_common_servers_text");
        connectionStatusUserAsideProfileInCommonServersText.textContent = "serveur en commun";     
        connectionStatusUserAsideProfileInCommonServersTextContainer.append(connectionStatusUserAsideProfileInCommonServersNumber, connectionStatusUserAsideProfileInCommonServersSeparator, connectionStatusUserAsideProfileInCommonServersText);
        connectionStatusUserAsideProfileInCommonServersContainer.append(connectionStatusUserAsideProfileInCommonServersLogoWrapper, connectionStatusUserAsideProfileInCommonServersTextContainer);

        connectionStatusUserAsideProfileTopSection.append(connectionStatusUserAsideProfileFeaturesContainer, connectionStatusUserAsideProfileAvatarContainer);
        connectionStatusUserAsideProfileBottomSection.append(connectionStatusUserAsideProfileNameUsernameContainer, connectionStatusUserAsideProfileInCommonServersContainer);

        connectionStatusUserAsideProfileContainer.append(connectionStatusUserAsideProfileTopSection, connectionStatusUserAsideProfileBottomSection);

        container.appendChild(connectionStatusUserAsideProfileContainer);
        
        if (user.ref === app.localUser.ref) {
            connectionStatusUserAsideProfileFeaturesContainer.remove();
        } else {
            connectionStatusUserAsideProfileAdd.addEventListener("click", (event) => { app.addUserPrivate(event); });
        }

    }

}