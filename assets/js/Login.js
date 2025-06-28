class Login {
    elements = {
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
    }
    userData = {
        email: null,
        name: null,
        password: null,
        date: null,
        ref: null,
        color: null,
        avatar: null,
        status: null
    };
    app;
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
        this.presets();
        this.events();
    }
    presets() {
        let userData;

        if (localStorage.getItem("discord")) {
            userData = JSON.parse(localStorage.getItem("discord"));
        } else {
            let username = "user" + (Math.floor(Math.random() * 9999 - 1000 + 1) + 1000);
            userData = {
                user: new User({
                    ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
                    email: username + "@gmail.com",
                    name: "Kaydash",
                    username: username,
                    password: "Abc12345**",
                    date: new Date().toLocaleString("fr-FR"),
                    color: this.settings.colorsList[Math.floor(Math.random() * this.settings.colorsList.length - 1)],
                    avatar: { image: "discord_logo.png", bgcolor: this.settings.colorsList[Math.floor(Math.random() * this.settings.colorsList.length - 1)] },
                    status: "online",
                    local: true
                })
            };
        }
        console.log("userData:", userData);        
        this.elements.email.value = userData.user.username;
        this.elements.name.value = userData.user.name;
        this.elements.password.value = userData.user.password;
        this.elements.date.value = userData.user.date;
        this.elements.ref.value = userData.user.ref;
        this.elements.color.value = userData.user.color;
        this.elements.avatar.value = JSON.stringify(userData.user.avatar);
        this.elements.status.value = userData.user.status;

        this.checkFields();
    }
    events() {
        this.elements.form.addEventListener("submit", this.submit.bind(this));
        this.elements.inputs.forEach(input => {
            input.addEventListener("input", this.checkFields.bind(this));            
        });
        document.querySelector(".login_need_register_link").addEventListener("click", () => { this.app.elements.main.dataset.view = "register"; });
    }
    submit(event) {
        event.preventDefault();
        console.log("form:", this.elements.form);        
        if (this.elements.email.value === "" || this.elements.password.value === "") {
            return console.log("Don't forget to complete the fields");
        }
        for (const prop in this.elements) {
            if (prop !== "form" && prop !== "submit" && prop !== "inputs")
                this.userData[prop] = this.elements[prop].value;
        }

        const localUser = new User({
            ref: this.userData.ref,
            email: this.userData.email + "@gmail.com",
            name: this.userData.name,
            username: this.userData.email,
            password: this.userData.password,
            date: this.userData.date,
            color: this.userData.color,
            avatar: JSON.parse(this.userData.avatar),
            status: this.userData.status,
            local: true
        });
        console.log("localUser:", localUser);

        let discordData;
        if (localStorage.getItem("discord")) {
            discordData = JSON.parse(localStorage.getItem("discord"));
        } else {
            discordData = { user: null }
        }
        discordData.user = localUser;
        localStorage.setItem("discord", JSON.stringify(discordData));

        this.app.setLocalUser(localUser);
        this.app.setChat(new Chat(this.app.getLocalUser(), this.app.getPrivateMessages()));

        console.log("this.app:", this.app);

        this.app.elements.main.setAttribute("data-view", "chatuser");
        
    }

    checkFields() {
        if (this.elements.email.value !== "" &&
            this.elements.password.value !== "") {
            console.log("enable");
            this.elements.submit.disabled = false;
        } else {
            console.log("disable");
            this.elements.submit.disabled = true;
        }
    }
}