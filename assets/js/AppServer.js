class AppServer {
    name;
    avatar;
    visibility;
    roomsList = [];
    constructor(serverData) {
        this.name = serverData.name;
        this.avatar = serverData.avatar;
        this.visibility = serverData.visibility;
    }
    addRoom(room) {
        const roomAlreadyPresent = this.roomsList.find(r => r.name === room.name);
        if (typeof roomAlreadyPresent === "undefined") {
            this.roomsList.push(room);
        }
        if (document.querySelector("main").dataset.view === "rooms") this.updateRoomsSection();
    }

    removeRoom(room) {
        let indexOfRoom = this.roomsList.indexOf(room);
        if (indexOfRoom > 0) this.roomsList.splice(indexOfRoom, 1);
        if (document.querySelector("main").dataset.view === "rooms") this.updateRoomsSection();
    }

    showRooms() {
        this.updateRoomsSection();
    }

    updateRoomsSection() {
        const roomsContainer = document.querySelector(".rooms-container");
        while (roomsContainer.firstChild) {
            roomsContainer.lastChild.remove();
        }
        const serverDetailsDropdown = document.querySelector(".server_details_dropdown");
        while (serverDetailsDropdown.firstChild) {
            serverDetailsDropdown.lastChild.remove();
        }
        this.roomsList.forEach((room, index) => {
            const roomContainer = document.createElement("div");
            roomContainer.classList.add("room-container", "left_panel_button");
            roomContainer.setAttribute("aria-selected", "false");
            roomContainer.tabIndex = index === 0 ? 0 : -1;
            const roomLogo = document.createElement("span");
            roomLogo.classList.add("room_logo");
            const roomLogoIcon = document.createElement("i");
            roomLogoIcon.classList.add("fa-solid", "fa-hashtag");
            roomLogo.appendChild(roomLogoIcon);
            const roomName = document.createElement("span");
            roomName.classList.add("room_name");
            roomName.innerText = room.name.replaceAll(" ", "-");
            roomContainer.append(roomLogo, roomName);
            roomsContainer.appendChild(roomContainer);

            document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));

            roomContainer.addEventListener("click", roomContainerButtonsActivation);

            function roomContainerButtonsActivation(event) {
                document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));
                event.currentTarget.classList.add("active");
                room.updateConnectionStatusSection();
            }

            const serverDetailsDropdownJoinQuitRoom = document.createElement("div");
            serverDetailsDropdownJoinQuitRoom.classList.add("server_details_dropdown_join_quit_room");
            serverDetailsDropdownJoinQuitRoom.setAttribute("data-name", room.name.replaceAll(" ", "-"));
            const serverDetailsDropdownRoomAction = document.createElement("span");
            serverDetailsDropdownRoomAction.classList.add("server_details_dropdown_room_action");
            serverDetailsDropdownRoomAction.setAttribute("data-action", "join");
            serverDetailsDropdownRoomAction.textContent = "Joindre";
            const serverDetailsDropdownRoomName = document.createElement("span");
            serverDetailsDropdownRoomName.classList.add("server_details_dropdown_room_name");
            serverDetailsDropdownRoomName.textContent = room.name.replaceAll(" ", "-");
            serverDetailsDropdownJoinQuitRoom.append(serverDetailsDropdownRoomAction, serverDetailsDropdownRoomName);
            serverDetailsDropdown.appendChild(serverDetailsDropdownJoinQuitRoom);

            serverDetailsDropdownJoinQuitRoom.addEventListener("click", serverDetailsDropdownJoinQuitRoomButtonsActivation.bind(this));

            function serverDetailsDropdownJoinQuitRoomButtonsActivation(event) {
                document.querySelectorAll(".server_details_dropdown_join_quit_room").forEach(button => button.classList.remove("active"));
                event.currentTarget.classList.add("active");
                this.joinRoom(room);
            }
        });
    }

    joinRoom(room) {
        console.log("joinRoom room:", room);
        room.addUser(app.localUser);
    }

    
}