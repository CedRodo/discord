class AppServer {
    name;
    avatar;
    visibility;
    roomsList = [];

    constructor(serverData) {
        this.currentRoom = null;
        this.name = serverData.name;
        this.avatar = serverData.avatar;
        this.visibility = serverData.visibility;
    }

    addRoom(room) {
        console.log("addRoom room:", room);        
        const roomAlreadyPresent = this.getRooms().find(r => r.name === room.name);
        if (typeof roomAlreadyPresent === "undefined") {
            this.getRooms().push(room);
        }
        if (app.mode === "rooms") this.updateRoomsSection();
    }

    removeRoom(room) {
        let indexOfRoom = this.getRooms().indexOf(room);
        if (indexOfRoom > 0) this.getRooms().splice(indexOfRoom, 1);
        if (app.mode === "rooms") this.updateRoomsSection();
    }

    setCurrentRoom(room) {
        this.currentRoom = room;
    }

    getCurrentRoom() {
        return this.currentRoom;
    }

    getRooms() {
        return this.roomsList;
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
        this.getRooms().forEach((room, index) => {
            const roomContainer = document.createElement("div");
            roomContainer.classList.add("room-container", "left_panel_button");
            roomContainer.setAttribute("aria-selected", false);
            roomContainer.setAttribute("data-name", room.name);
            roomContainer.tabIndex = index === 0 ? 0 : -1;
            const roomLogo = document.createElement("span");
            roomLogo.classList.add("room_logo");
            const roomLogoIcon = document.createElement("i");
            roomLogoIcon.classList.add("fa-solid", "fa-hashtag");
            roomLogo.appendChild(roomLogoIcon);
            const roomName = document.createElement("span");
            roomName.classList.add("room_name");
            roomName.innerText = room.name;
            roomContainer.append(roomLogo, roomName);
            roomsContainer.appendChild(roomContainer);

            document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));

            roomContainer.addEventListener("click", () => { roomContainerButtonsActivation(room); });

            function roomContainerButtonsActivation(room) {
                console.log("roomContainerButtonsActivation");                
                document.querySelectorAll(".left_panel_button").forEach(button => button.classList.remove("active"));
                
                document.querySelector(`.room-container[data-name="${room.name}"]`).classList.add("active");
                document.querySelector(`.room-container[data-name="${room.name}"]`).setAttribute("aria-selected", true);

                document.querySelector(".chat_room_name").textContent = room.name;
                document.querySelector(".chat_room_name").dataset.name = room.name;
                if (document.querySelector(".chat_room_name-container").classList.contains("hide"))
                    document.querySelector(".chat_room_name-container").classList.remove("hide");
                if (document.querySelector(".chat_message_to_send-container").classList.contains("hide"))
                    document.querySelector(".chat_message_to_send-container").classList.remove("hide");
                socket.emit('room-users', room.name);
                room.updateConnectionStatusSection();
            }

            let isPresentInRoom = false;

            if (room.getUsers()) {
                const roomUsersList = room.getUsers();
                console.log("roomUsersList:", roomUsersList);

                console.log("app.localUser.username:", app.localUser.username);

                roomUsersList.forEach(u => {
                    console.log("room u.username:", u.username);
                    if (u.username === app.localUser.username) isPresentInRoom = true;
                });

                console.log("isPresentInRoom:", isPresentInRoom); 
            }  

            const serverDetailsDropdownJoinQuitRoom = document.createElement("div");
            serverDetailsDropdownJoinQuitRoom.classList.add("server_details_dropdown_join_quit_room");
            serverDetailsDropdownJoinQuitRoom.setAttribute("data-name", room.name);
            const serverDetailsDropdownRoomAction = document.createElement("span");
            serverDetailsDropdownRoomAction.classList.add("server_details_dropdown_room_action");
            serverDetailsDropdownRoomAction.setAttribute("data-action", isPresentInRoom ? "leave" : "join");
            serverDetailsDropdownRoomAction.textContent = isPresentInRoom ? "Quitter" : "Joindre";
            const serverDetailsDropdownRoomName = document.createElement("span");
            serverDetailsDropdownRoomName.classList.add("server_details_dropdown_room_name");
            serverDetailsDropdownRoomName.textContent = room.name;
            serverDetailsDropdownJoinQuitRoom.append(serverDetailsDropdownRoomAction, serverDetailsDropdownRoomName);
            serverDetailsDropdown.appendChild(serverDetailsDropdownJoinQuitRoom);

            serverDetailsDropdownJoinQuitRoom.addEventListener("click", serverDetailsDropdownJoinQuitRoomButtonsActivation.bind(this));

            function serverDetailsDropdownJoinQuitRoomButtonsActivation(event) {
                document.querySelectorAll(".server_details_dropdown_join_quit_room").forEach(button => button.classList.remove("active"));
                event.currentTarget.classList.add("active");
                switch (serverDetailsDropdownRoomAction.dataset.action) {
                    case "join":
                        this.joinRoom(room);
                        serverDetailsDropdownRoomAction.setAttribute("data-action", "leave");
                        serverDetailsDropdownRoomAction.textContent = "Quitter";
                        break;
                    case "leave":
                        this.leaveRoom(room);
                        serverDetailsDropdownRoomAction.setAttribute("data-action", "join");
                        serverDetailsDropdownRoomAction.textContent = "Joindre";
                        break;
                }
                roomContainerButtonsActivation(room);
            }
        });
    }

    joinRoom(room) {
        console.log("joinRoom room:", room);
        // room.addUser(app.localUser);
        // const roomContainer = document.querySelector(`.room-container[data-name="${room.name}"]`);
        // console.log("roomContainer:", roomContainer);        
        // roomContainer.classList.add("active");
        // roomContainer.setAttribute("aria-selected", true);
        socket.emit('join-room', room.name);
    }

    leaveRoom(room) {
        console.log("leaveRoom room:", room);
        // room.addUser(app.localUser);
        socket.emit('leave-room', room.name);
    }

    
}