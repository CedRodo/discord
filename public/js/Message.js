class Message {
    content;
    date;
    constructor(content) {
        this.content = content;
        this.date = new Date().toLocaleString("fr-FR");
    }

    createMessage() {
        const chatMessage = document.createElement("div");
        chatMessage.classList.add("chat_message");
        chatMessage.innerText = this.content;
        return chatMessage;
    }
}