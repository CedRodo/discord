class Element {
    constructor() {
        this.login = {
            form: document.getElementById("login_form"),
            inputs: document.querySelectorAll("input"),
            email: document.getElementById("login_email"),
            name: document.getElementById("login_name"),
            password: document.getElementById("login_password"),
            date: document.getElementById("login_date"),
            ref: document.getElementById("login_ref"),
            color: document.getElementById("login_color"),
            avatar: document.getElementById("login_avatar"),
            status: document.getElementById("login_status"),
            submit: document.getElementById("login_submit")
        };
        this.register = {
            form: document.getElementById("register_form"),
            inputs: document.querySelectorAll("input"),
            email: document.getElementById("register_email"),
            name: document.getElementById("register_name"),
            username: document.getElementById("register_username"),
            password: document.getElementById("register_password"),
            policies: document.getElementById("register_policies_agreement_check"),
            submit: document.getElementById("register_submit")
        }
        this.app = {
            main: document.querySelector("main"),
            sidebarButtons: document.querySelectorAll(".sidebar_button"),
            showPrivateMessages: document.querySelector(".show_private_messages-container"),
            servers: document.querySelectorAll(".server-container"),
            features: document.querySelectorAll(".feature"),
            messageToSend: document.getElementById("message_to_send"),
            chatRoomAvatarWrapper: document.querySelector(".chat_room_avatar-wrapper"),
            chatRoomAvatar: document.querySelector(".chat_room_avatar"),
            chatRoomProfileStatus: document.querySelector(".chat_room_profile_status"),
            chatRoomName: document.querySelector(".chat_room_name"),
            chatRoomNameContainer: document.querySelector(".chat_room_name-container"),
            chatMessageToSendContainer: document.querySelector(".chat_message_to_send-container"),
            chatWindow: document.querySelector(".chat_window")
        }
    }

    getLoginElements() {
        return this.login;
    }

    getRegisterElements() {
        return this.register;
    }

    getAppElements() {
        return this.app;
    }
}