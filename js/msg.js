import { getDatabase, ref,update, increment } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import Chat from "./chat.js";
import SYS from "./sys.js";
const db = getDatabase();

export default class Msg {
    #currentmsg = {}
    #data = { sendername: null, senderphoto: null }
    #uid = null;
    #event = null;

    owen = false;

    seen = false;
    seentarget = null;

    set updateseen(status = false) {
        if (status == true) {
            this.seentarget.classList.remove("d-none");
            this.seen = true;
        } else if (status == false) {
            this.seentarget.classList.add("d-none");
            this.seen = false;
        }
    }

    static displaymode = {
        normal: (msg) => {
            if (msg.#data.text == "#MSGSSTARTINGPOINT#") { return this.displaymode.info(msg); }
            if (msg.#currentmsg.owned) {
                const msgcon = document.createElement("aside");
                msgcon.classList.add("sendermsgcontainer");
                msgcon.innerHTML = `
                                        <div class="msgsenderphoto" style="background-image:url('${msg.#currentmsg.sender.photo ? msg.#currentmsg.sender.photo : "../photo/login.png"}');background-size:${msg.#currentmsg.sender.photo ? "cover" : "15px"};"></div>
                                        <div class="msgtxt">
                                            ${msg.#data.text}
                                        </div>
                                        <div class="msgdate">
                                            <span>${SYS.datecalculate(msg.#data.date)}</span>
                                        </div>
                                    `
                
                const onlinebadge = document.createElement("span");
                onlinebadge.classList.add("badge", "seen", "d-none");
                onlinebadge.innerHTML = "&#xf00c;";
                msg.seentarget = onlinebadge;
                msgcon.children[2].appendChild(onlinebadge);

                if (msg.#data.seen == "1") {
                    msg.updateseen = true;
                }

                Chat.msgs[msg.#data.id] = {
                    obj: msg,
                    target: msgcon
                }

                return msgcon;

            } else {
                const msgcon = document.createElement("aside");
                msgcon.classList.add("contactmsgcontainer");
                msgcon.innerHTML = `
                                        <div class="msgsenderphoto" style="background-image:url('${msg.#currentmsg.sender.photo ? msg.#currentmsg.sender.photo : "../photo/login.png"}');background-size:${msg.#currentmsg.sender.photo ? "cover" : "15px"};"></div>
                                        <div class="msgtxt">
                                            ${msg.#data.text}
                                        </div>
                                        <div class="msgdate">
                                            <span class="badge seen">&#xf00c;</span>
                                            <span>${SYS.datecalculate(msg.#data.date)}</span>
                                        </div>
                                    `
                msg.seen = true;
                if (msg.#data.seen == "0") {

                    update(ref(db, "/chat/rooms/" + Chat.currentroomid + "/" + msg.#data.id), { seen: "1" }).then(() => { 
                        msg.#data.seen = "1";
                    });

                    update(ref(db, "/chat/roomstatus/" + msg.#uid + "/" + Chat.currentroomid), { unread: increment(-1) });
                }
                Chat.msgs[msg.#data.id] = {
                    obj: msg,
                    target: msgcon
                }

                return msgcon;
            }
        },
        info: (msg) => { 
            if (msg.#currentmsg.owned) {
                const msgcon = document.createElement("aside");
                msgcon.classList.add("infocontainer");
                msgcon.innerHTML = `
                                        <div class="infophoto" style="background-image:url('${msg.#currentmsg.sender.photo ? msg.#currentmsg.sender.photo : "../photo/login.png"}');background-size:${msg.#currentmsg.sender.photo ? "cover" : "15px"};"></div>
                                        <div class="infotxt">
                                            ${msg.#currentmsg.sender.name + " has started this chat at " + SYS.datecalculate(msg.#data.date)}
                                        </div>
                                        <div class="infoseen">
                                            <span></span>
                                        </div>
                                    `

                const onlinebadge = document.createElement("span");
                onlinebadge.classList.add("badge", "seen", "d-none");
                onlinebadge.innerHTML = "&#xf00c;";
                msg.seentarget = onlinebadge;
                msgcon.children[2].appendChild(onlinebadge);

                if (msg.#data.seen == "1") {
                    msg.updateseen = true;
                }

                Chat.msgs[msg.#data.id] = {
                    obj: msg,
                    target: msgcon
                }

                return msgcon;

            } else {
                const msgcon = document.createElement("aside");
                msgcon.classList.add("infocontainer");
                msgcon.innerHTML = `
                                        <div class="infophoto" style="background-image:url('${msg.#currentmsg.sender.photo ? msg.#currentmsg.sender.photo : "../photo/login.png"}');background-size:${msg.#currentmsg.sender.photo ? "cover" : "15px"};"></div>
                                        <div class="infotxt">
                                            ${msg.#currentmsg.sender.name + " has started this chat at " + SYS.datecalculate(msg.#data.date) }
                                        </div>
                                        <div class="infoseen">
                                            <span class="badge seen">&#xf00c;</span>
                                        </div>
                                    `
                msg.seen = true;
                if (msg.#data.seen == "0") {

                    update(ref(db, "/chat/rooms/" + Chat.currentroomid + "/" + msg.#data.id), { seen: "1" }).then(() => {
                        msg.#data.seen = "1";
                    });

                    update(ref(db, "/chat/roomstatus/" + msg.#uid + "/" + Chat.currentroomid), { unread: increment(-1) });
                }
                Chat.msgs[msg.#data.id] = {
                    obj: msg,
                    target: msgcon
                }

                return msgcon;
            }
        }
    }

    constructor(data = {}, uid = null, click = null, user = {}, contact = {}) {//getreplay = null, isreplay = false, replayonpath = null
        this.#data = data;
        this.#uid = uid;
        this.#event = click;

        if (data.sender==uid) { 
            this.#currentmsg["sender"] = user;
            this.#currentmsg["owned"] = true;
            this.owen = true;
        } else if (data.sender == contact.id) {
            this.#currentmsg["sender"] = contact;
            this.#currentmsg["owned"] = false;
        }
    }

    create(displaymode) {
        if (this.#uid) {

            return displaymode(this)

        } else { this.nouid() }
    }
    static destroy(pageitem = {}) {
        pageitem.target.remove();
        pageitem.obj = null;
        delete Chat.msgs[pageitem.id];
    }
    static nouid = () => { }

}

