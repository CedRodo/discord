class User {
    constructor(userData) {
        this.ref = userData.ref;
        this.name = userData.name;
        this.color = userData.color;
        this.avatar = userData.avatar;
        this.status = userData.status;
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