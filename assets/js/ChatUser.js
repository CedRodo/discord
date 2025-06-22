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
        this.chat = new Chat(this);
    }

    showProfile() {
        document.querySelector(".chat_user_profile_panel").style.setProperty("--bgcolor_pref", this.avatar.bgcolor);
        document.querySelector(".chat_user_profile_avatar").src = `./assets/img/${this.avatar.image}`;
        document.querySelector(".chat_user_profile_status").dataset.status = this.status;
        document.querySelector(".chat_user_profile_name").textContent = this.name;
        document.querySelector(".chat_user_profile_username").textContent = this.username;
        document.querySelector(".chat_user_profile_details_about_me_content").textContent = this.aboutme;
        document.querySelector(".chat_user_profile_details_member_since_content").textContent = this.membersince;
    }
}