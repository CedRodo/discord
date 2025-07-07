class ChatUser {
    constructor(user) {
        this.ref = user.ref;
        this.name = user.name;
        this.username = user.username;
        this.avatar = user.avatar;
        this.color = user.color;
        this.status = user.status;
        this.aboutme = "Aucun texte";
        this.membersince = user.date;
        this.isLocal = user.local;
    }
}