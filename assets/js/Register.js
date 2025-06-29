class Register {
    elements = {
        form: document.getElementById("register_form"),
        inputs: document.querySelectorAll("input"),
        email: document.getElementById("register_email"),
        name: document.getElementById("register_name"),
        username: document.getElementById("register_username"),
        password: document.getElementById("register_password"),
        policies: document.getElementById("register_policies_agreement_check"),
        submit: document.getElementById("register_submit")
    }
    userData = {
        email: null,
        name: null,
        username: null,
        password: null,
        date: null
    };
    app;
    settings;
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
        this.presets();
        this.events();
    }
    presets() {
        let username = "user" + (Math.floor(Math.random() * 9999 - 1000 + 1) + 1000);
        this.elements.email.value = username + "@gmail.com";
        this.elements.username.value = username;
        this.elements.password.value = "Abc12345*";
    }
    events() {
        this.elements.form.addEventListener("submit", this.submit.bind(this));
        this.elements.inputs.forEach(input => {
            input.addEventListener("input", this.checkFields.bind(this));
        });
    }

    submit(event) {
        event.preventDefault();
        console.log("form:", this.elements.form);
        
        if (!this.elements.policies.checked) return console.log("Don't forget to check the box");
        if (this.elements.email.value === "" ||
            this.elements.name.value === "" ||
            this.elements.username.value === "" ||
            this.elements.password.value === "") {
            return console.log("Don't forget to complete the fields");
        }
        this.elements.submit.disabled = false;
        for (const prop in this.elements) {
            if (prop !== "form" && prop !== "submit" && prop !== "inputs")
                this.userData[prop] = this.elements[prop].value;
        }
        this.userData.date = new Date().toLocaleString("fr-FR");

        const localUser = new User({
            ref: (Math.floor(Math.random() * 99999999 - 10000000 + 1) + 10000000).toString(),
            email: this.userData.email,
            name: this.userData.name,
            username: this.userData.username,
            password: this.userData.password,
            date: this.userData.date,
            color: this.settings.colorsList[Math.floor(Math.random() * this.settings.colorsList.length - 1)],
            avatar: { image: "discord_logo.png", bgcolor: this.settings.colorsList[Math.floor(Math.random() * this.settings.colorsList.length - 1)] },
            status: "online",
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

        socket.emit('new-user', localUser);
        
    }

    checkFields() {
        if (this.elements.policies.checked &&
            this.elements.email.value !== "" &&
            this.elements.name.value !== "" &&
            this.elements.username.value !== "" &&
            this.elements.password.value !== "") {
            console.log("enable");
            this.elements.submit.disabled = false;
        } else {
            console.log("disable");
            this.elements.submit.disabled = true;
        }
    }
}