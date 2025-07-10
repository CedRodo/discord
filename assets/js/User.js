class User {
    constructor(userData) {
        this.ref = userData.ref;
        this.email = userData.email;
        this.name = userData.name;
        this.username = userData.username;
        this.password = userData.password;
        this.date = userData.date;
        this.color = userData.color;
        this.avatar = userData.avatar;
        this.status = userData.status;
        this.local = userData.local;
        this.chatUser = new ChatUser(this);
        this.roomsList = [];
    }

    getChatUser() {
        return this.chatUser;
    }

    getRooms() {
        return this.roomsList;
    }

    setRoom(room) {
        let isAlreadyPresent = false;
        this.roomsList.forEach(r => {
            if (r.ref === room.ref) isAlreadyPresent = true
        });
        if (!isAlreadyPresent) this.roomsList.push(room);
    }

    setStatus(status) {
        const previousStatus = this.status;
        this.status = status;

        switch (status) {
            case "online":
                if (previousStatus === "online" ||
                    previousStatus === "sleep" ||
                    previousStatus === "busy"
                ) {

                } else {
                    
                }
        }
    }
}