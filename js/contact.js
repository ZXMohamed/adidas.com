import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getallurl } from "./storageconfig.js";
import Chat from "./chat.js";
const db = getDatabase();

export default class Contact {
    #currentcontact = {}
    #data = {}
    #uid = null;
    #event = null;

    
    unread = 0;
    unreadtarget = null;

    online = false;
    onlinetarget = null;


    set updateunread(num = 0) {
        if (num > 0) {
            this.unreadtarget.classList.remove("d-none");
            this.unreadtarget.innerText = num;
            this.unread = num;
        } else if (num <= 0) {
            this.unreadtarget.classList.add("d-none");
            this.unreadtarget.innerText = 0;
            this.unread = 0;
        }
    }

   
    set updateonline(status = false) {
        if (status == true) {
            this.onlinetarget.classList.remove("d-none");
            this.online = true;
        } else if (status == false) {
            this.onlinetarget.classList.add("d-none");
            this.online = false;
        }
    }


    static displaymode = {
        normal: (contact) => {
            const contactbar = document.createElement("button");
            contactbar.classList.add("list-group-item", "list-group-item-action", "contactbar");;

            const contactphoto = document.createElement("div");
            contactphoto.classList.add("contactphoto");

            getallurl("/callcenterprofile/" + contact.#data.id + "/photo", (urls) => {
                contactphoto.style = `background-image:url('${urls[0] ? urls[0] : "../photo/login.png"}')`;
                contact.#data["photo"] = urls[0]
                urls[0] ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";

            })
            contactbar.appendChild(contactphoto);


            const contactname = document.createElement("span");
            contactname.classList.add("contactname");
            contactname.innerText = contact.#data.name;
            contactbar.appendChild(contactname);

            if (Object.hasOwn(contact.#data, "room")) {

                const contactstatus = document.createElement("div");
                contactstatus.classList.add("contactonline");

                const onlinebadge = document.createElement("span");
                onlinebadge.classList.add("badge",  "text-bg-success", "d-none");
                onlinebadge.innerText = "Online";
                contact.onlinetarget = onlinebadge;
                contactstatus.appendChild(onlinebadge);

                contact.updateonline = contact.#data.online;
                
                const unreadbadge = document.createElement("span");
                unreadbadge.classList.add("badge", "text-bg-danger", "d-none");

                contact.unreadtarget = unreadbadge;
                contactstatus.appendChild(unreadbadge);

                contact.updateunread = contact.#data.unread;

                contactbar.appendChild(contactstatus);

                Chat.rooms[contact.#data.room] = {
                    obj: contact,
                    target: contactbar
                }
            } else if (Object.hasOwn(contact.#data, "online")) {
                const contactstatus = document.createElement("div");
                contactstatus.classList.add("contactonline");

                const onlinebadge = document.createElement("span");
                onlinebadge.classList.add("badge",  "text-bg-success", "d-none");
                onlinebadge.innerText = "Online";
                contact.onlinetarget = onlinebadge;
                contactstatus.appendChild(onlinebadge);

                contact.updateonline = contact.#data.online;

                contactbar.appendChild(contactstatus);

                Chat.online[contact.#data.id] = {
                    obj: contact,
                    target: contactbar
                }
            }

            contactbar.addEventListener("click", contact.#event.bind(null, contact.#data));

            return contactbar
        },
        mini: async(contact) => {

            const contactbar = document.createElement("button");
            contactbar.classList.add("list-group-item", "list-group-item-action", "contactbarmini");

            const contactphoto = document.createElement("div");
            contactphoto.classList.add("contactphotomini");

            getallurl("/callcenterprofile/" + contact.#data.id + "/photo", (urls) => {
                contactphoto.style = `background-image:url('${urls[0] ? urls[0] : "../photo/login.png"}')`;
                contact.#data["photo"] = urls[0];
                urls[0] ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";
            })
            contactbar.appendChild(contactphoto);


            const contactname = document.createElement("span");
            contactname.classList.add("contactnamemini");
            let contactinfo = await get(ref(db, "callcenterprofile/" + contact.#data.id));

            contactname.innerText = contactinfo.val().name;

            contactbar.appendChild(contactname);

            if (Object.hasOwn(contact.#data, "room")) {

                const contactstatus = document.createElement("div");
                contactstatus.classList.add("contactonlinemini");

                const onlinebadge = document.createElement("span");
                onlinebadge.classList.add("badge",  "text-bg-success", "d-none");
                onlinebadge.innerText = "Online";
                contact.onlinetarget = onlinebadge;
                contactstatus.appendChild(onlinebadge);

                contact.updateonline = contact.#data.online;

                const unreadbadge = document.createElement("span");
                unreadbadge.classList.add("badge", "text-bg-danger", "d-none");

                contact.unreadtarget = unreadbadge;
                contactstatus.appendChild(unreadbadge);

                contact.updateunread = contact.#data.unread;

                contactbar.appendChild(contactstatus);

            }else if (Object.hasOwn(contact.#data, "online")) {

                const contactstatus = document.createElement("div");
                contactstatus.classList.add("contactonline");
                const onlinebadge = document.createElement("span");
                onlinebadge.classList.add("badge",  "text-bg-success", "d-none");
                onlinebadge.innerText = "Online";
                contact.onlinetarget = onlinebadge;
                contactstatus.appendChild(onlinebadge);

                contact.updateonline = contact.#data.online;

                contactbar.appendChild(contactstatus);

                Chat.online[contact.#data.id] = {
                    obj: contact,
                    target: contactbar
                }
            }  

            contactbar.addEventListener("click", contact.#event.bind(null, contact.#data));

            return contactbar;
        },
        referenced: async (contact) => {

            let contactinfo = await get(ref(db, "callcenterprofile/" + contact.#data.id));

            if (contactinfo.exists()) {

                if (Object.hasOwn(contact.#data, "room")) {
                    let roomstatus = await get(ref(db, "chat/roomstatus/" + contact.#uid + "/" + contact.#data.room));

                    let onlinestatus = await get(ref(db, "chat/online/" + contact.#data.id));
                    
                    contact.#data = { ...contact.#data, ...roomstatus.val(), ...onlinestatus.val() };

                }

                contact.#data = { ...contact.#data, ...contactinfo.val() };

                return this.displaymode.normal(contact);
            }
            else {
                return this.displaymode.notfound(contact);
            }
        },
        notfound: (contact) => {
            const contactbar = document.createElement("button");
            contactbar.classList.add("list-group-item", "list-group-item-action", "contactbar");

            const contactphoto = document.createElement("div");
            contactphoto.classList.add("contactphoto");

            contactbar.appendChild(contactphoto);


            const contactname = document.createElement("span");
            contactname.classList.add("contactname");
            contactname.innerText = "Not Found"
            contactbar.appendChild(contactname);

            return contactbar;
        }
    }

    constructor(data = {}, uid = null, click = null) {
        this.#data = data;
        this.#uid = uid
        this.#event = click
    }

    create(displaymode) {
        if (this.#uid) {
            return displaymode(this)
        } else { this.nouid() }

    }
    static destroy(pageitem = {}) {
        pageitem.target.remove();
        pageitem.obj = null;
        if (Object.hasOwn(obj.#data, "room")) { 
            delete Chat.rooms[pageitem.obj.#data.room];
        }
        else if (Object.hasOwn(obj.#data, "online")) {
            delete Chat.online[pageitem.id];
        }
        
    }
    static nouid = () => { }

}