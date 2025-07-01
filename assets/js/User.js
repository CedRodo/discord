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
    }

    getChatUser() {
        return this.chatUser;
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