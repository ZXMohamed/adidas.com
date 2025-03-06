import { app } from "./serverconfig.js";
import { getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const db = getDatabase();
import { getallurl } from "./storageconfig.js";
import { getuser } from "./signed.js";
import Page from "./page.js";
import Contact from "./contact.js";
import Chat from "./chat.js";
import Msg from "./msg.js";
import SYS from "./sys.js";

const contactphoto = document.getElementById("contactphoto");
const contactname = document.getElementById("contactname");

const senderphoto = document.getElementById("senderphoto");

const textinput = document.getElementById("textinput");
const sendbtn = document.getElementById("sendbtn");

const navroom = document.getElementById("nav-room");


let photo = "";
let name = "";
let uid = null;
let online = null;
let contacts = null;
let msgs = null;

Page.nouid = SYS.nouid
Contact.nouid = SYS.nouid
Msg.nouid = SYS.nouid
Chat.nouid = SYS.nouid
Chat.chatuiopen = true;


getuser((id) => {
    uid = id;
    if (id) {
        get(ref(db, "users/" + id + "/name")).then((uname) => {
            name = uname.val();
            contactname.innerText = uname.val();
        })
        getallurl("/customerphoto/" + id + "/photo", (urls) => {
            photo = urls[0]
            contactphoto.style.backgroundImage = `url('${urls[0]?urls[0]:"../photo/login.png"}')`;
            urls[0] ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";
        });
        loadpage();
    } else {
        Chat.nouid();
        online && (document.getElementById("onlinepool").onscroll = () => { }) && online.empty();
        contacts && (document.getElementById("contactspool").onscroll = () => { }) && contacts.empty();
        msgs && msgs.empty();
    }
})
function loadpage() {

    online && (document.getElementById("onlinepool").onscroll = () => { })&&online.empty();
    contacts && (document.getElementById("contactspool").onscroll = () => { })&&contacts.empty();
    msgs&&msgs.empty();



    online = new Page("/chat/online", Contact, [uid, createroom], Contact.displaymode.referenced, 8, null, document.getElementById("onlinepool"))
    online.scrolldown(() => {  }, () => { }, false, true, false)

    document.getElementById("onlinepool").onscroll = async (e) => {
        const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
        if (e.target.scrollTop == max) {
            await online.scrolldown(() => { }, () => { }, false, true, false);
        }
        else if (e.target.scrollTop == 0) {
            await online.scrollup(() => { e.target.scrollTo(0, 100) }, () => { }, true, false, false);
        }

    }

    contacts = new Page("/chat/contacts/" + uid, Contact, [uid, openroom], Contact.displaymode.referenced, 8, null, document.getElementById("contactspool"))
    contacts.scrolldown(() => {  }, () => { }, false, true, false)


    document.getElementById("contactspool").onscroll = async (e) => {
        const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
        if (e.target.scrollTop == max) {
            await contacts.scrolldown(() => { e.target.scrollTo(0, 50) }, () => { }, false, true, false);
        }
        else if (e.target.scrollTop == 0) {
            await contacts.scrollup(() => { e.target.scrollTo(0, 50) }, () => { }, true, false, false);

        }

    }

    //$ open listeners
    Chat.uid = uid;

    Chat.roomsstatuslisten(async(contact) => {
        await contacts.outerinject(contact, true, false, false,false);
    }, document.getElementById("alertpool"));

    Chat.onlinestatuslisten();
}





function createroom(contact) {
    if (uid) {
        Chat.createroom(contact,
            (contact) => { contacts.outerinject(contact, true, false, false,false); },
            () => { 
            //$get room msg + open listeners
            getmsgs(Chat.currentroomid);
            msgs.lastid().then((id) => { 
                Chat.msgslisten(id, async(msg) => { await msgs.outerinject(msg, false, false, true);}); 
            })
        });
        senderphoto.style.backgroundImage = `url('${photo?photo:"../photo/login.png"}')`;
        senderphoto.style.backgroundSize=photo?"cover":"15px";
        contactphoto.style.backgroundImage = `url('${contact.photo ? contact.photo : "../photo/login.png"}')`;
        contact.photo ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";
        contactname.innerText = contact.name;
        navroom.style.display="block";
    } else { this.nouid() }
}


function openroom(contact) {
    if (uid) {

        Chat.currentcontact = contact;
        Chat.currentroomid = contact.room;
        
        senderphoto.style.backgroundImage = `url('${photo?photo:"../photo/login.png"}')`;
        senderphoto.style.backgroundSize=photo?"cover":"15px";
        contactphoto.style.backgroundImage = `url('${contact.photo ? contact.photo : "../photo/login.png"}')`;
        contact.photo ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";
        contactname.innerText = contact.name;
        
        getmsgs(Chat.currentroomid);
        msgs.lastid().then((id) => { 
            Chat.msgslisten(id, async(msg) => { await msgs.outerinject(msg,false,false,true); });
        })
        
        navroom.style.display="block";

    } else { this.nouid() }    
}


async function getmsgs(roomid=null) { 
    
    msgs = new Page("/chat/rooms/" + roomid, Msg, [uid, () => { }, { name: name, photo: photo, id: uid }, Chat.currentcontact], Msg.displaymode.normal, 10, null, document.getElementById("msgspool"))
    await msgs.scrolldown(() => { document.getElementById("msgspool").scrollTo(0, 1000) }, () => { }, true,true, true);


    document.getElementById("msgspool").onscroll = async (e) => {
        const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
        if (e.target.scrollTop == max) {
            await msgs.scrollup(() => { }, () => { }, false, false, false);
        }
        else if (e.target.scrollTop == 0) {
            await msgs.scrolldown(() => {e.target.scrollTo(0, 100) }, () => { }, true, true, false);
        }

    }


}



sendbtn.addEventListener("click", () => {
    Chat.send(textinput.value)
    textinput.value = "";
});




document.getElementById("nav-online-tab").addEventListener("click", () => {
    contactname.innerText = name
    contactphoto.style.backgroundImage = `url('${photo ? photo : "../photo/login.png"}')`;
    photo ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";

    msgs?.empty();
    Chat.closemsgslisten();

    navroom.style.display="none"

})
document.getElementById("nav-chat-tab").addEventListener("click", () => {
    contactname.innerText = name
    contactphoto.style.backgroundImage = `url('${photo ? photo : "../photo/login.png"}')`;
    photo ? contactphoto.style.backgroundSize = "cover" : contactphoto.style.backgroundSize = "15px";
    msgs?.empty();
    Chat.closemsgslisten();

    navroom.style.display = "none"

})