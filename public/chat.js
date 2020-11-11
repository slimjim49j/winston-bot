const converter = new showdown.Converter();
converter.setOption('openLinksInNewWindow', true);

class Chat {
    constructor(Botkit) {
        this.Botkit = Botkit;

        this.responses = [];
        this.currIdx = 0;
        this.userSent = false;  

        this.initEventListeners();

        var source = document.getElementById('message-template').innerHTML;
        this.messageTemplate = Handlebars.compile(source);
    }

    initEventListeners() {
        const Botkit = this.Botkit;

        document.querySelector(".messenger-form")
            .addEventListener("submit", e => Botkit.send(Botkit.input.value, e));
        document.querySelector(".submit-text")
            .addEventListener("click", (e) => Botkit.send(Botkit.input.value, e));

        const chatInput = document.querySelector("#messenger-input");
        const footer = document.querySelector("#message-window footer");
        chatInput.addEventListener("focus", () => footer.classList.add("focus"));
        chatInput.addEventListener("blur", () => footer.classList.remove("focus"));

        const switchBtn = document.querySelector(".switch-chat-btn")
        const lessonContainer = document.querySelector(".main-lesson-container");
        switchBtn.addEventListener("click", (e) => {
            lessonContainer.classList.toggle("winston-view");
            if (!Array.from(lessonContainer.classList).includes("winston-view")) this.renderQuickReplies(this.responses[this.responses.length - 1]);
        });

        document.querySelector("#dialogue-next").addEventListener("click", e => {
            if (this.currIdx + 1 < this.responses.length) {
                this.currIdx++;
                this.renderWinstonMessage();
                this.renderQuickReplies(this.responses[this.currIdx]);
            }
        });
        document.querySelector("#dialogue-back").addEventListener("click", e => {
            if (this.currIdx > 0) {
                this.currIdx--;
                this.renderWinstonMessage();
                this.renderQuickReplies(this.responses[this.currIdx]);
            }
        });
    }

    renderMessage(message) {
        const messageList = document.getElementById("message-list");
        if (!this.next_line) {
            this.next_line = document.createElement('div');
            messageList.appendChild(this.next_line);
        }
        if (message.text) {
            message.html = converter.makeHtml(message.text);
        }

        this.next_line.innerHTML = this.messageTemplate({
            message: message
        });
        if (!message.isTyping) {
            delete (this.next_line);
        }
    }

    renderWinstonMessage() {
        let message = this.responses[this.currIdx];
        if (message.text) {
            message.html = converter.makeHtml(message.text);
            document.querySelector(".bot-dialogue").innerHTML = message.html;
        }

        const next = document.querySelector("#dialogue-next");
        const back = document.querySelector("#dialogue-back");
        // TODO:
        // when arr messages rendered, next button is disabled at first
        // message rendering also doesn't work for initial message and examples
        // should probably just get rid of example type

        if (!this.responses[this.currIdx + 1]) next.disabled = true;
        else next.disabled = false;
        if (!this.responses[this.currIdx - 1]) back.disabled = true;
        else back.disabled = false;
    }

    clearReplies() {
        let replies = document.getElementById('message-replies');
        replies.innerHTML = '';
    }

    renderQuickReplies(message) {
        const input = document.querySelector("#messenger-input");
        this.clearReplies();
        if (message.quick_replies) {

            const list = document.createElement('ul');

            let elements = [];
            let that = this;
            for (let r = 0; r < message.quick_replies.length; r++) {
                (function (reply) {

                    const li = document.createElement('li');
                    const el = document.createElement('a');
                    el.innerHTML = reply.title;
                    el.href = '#';

                    el.onclick = () => {
                        that.Botkit.quickReply(reply.payload);
                    }

                    li.appendChild(el);
                    list.appendChild(li);
                    elements.push(li);

                })(message.quick_replies[r]);
            }

            let replies = document.getElementById('message-replies');
            replies.appendChild(list);

            // uncomment this code if you want your quick replies to scroll horizontally instead of stacking
            // var width = 0;
            // // resize this element so it will scroll horizontally
            // for (var e = 0; e < elements.length; e++) {
            //     width = width + elements[e].offsetWidth + 18;
            // }
            // list.style.width = width + 'px';

            if (message.disable_input) {
                input.disabled = true;
            } else {
                input.disabled = false;
            }
        } else {
            input.disabled = false;
        }
    }
}

export default Chat;