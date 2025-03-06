import { getDatabase, ref, onChildChanged, onDisconnect, onChildAdded, orderByChild, serverTimestamp, push, child, startAfter, set, get, update, increment, query, equalTo, orderByKey } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import Toast from "./toast.js";
import Contact from "./contact.js";

const db = getDatabase();

export default class Chat {

    static uid = null;
    static currentroomid = null;
    static currentcontact = null;
    static msgs = {};
    static rooms = {};
    static online = {};
    static chatuiopen = false;
    static #closeroomsstatuslistener = () => { };
    static #closeonlinestatuslisten = () => { };
    static #closemsgslistenadd = () => { };
    static #closemsgslistenchange = () => { };

    
    constructor() {
        throw "can't make constructor for abstract class";
    }

    static setonline() { 
        if (this.uid) {
            update(ref(db, "/users/" + this.uid), { online: true });
            const presenceRef = ref(db, "/users/" + this.uid);
            onDisconnect(presenceRef).update({ online: false });
        }
    }

    static createroom(contact, callback, onexists) {
        //!if not exist
        if (this.uid) {
            get(ref(db, "/chat/contacts/" + this.uid + "/" + contact.id)).then((snapshot) => {
                if (!snapshot.exists()) {
                    let roomid = push(child(ref(db), '/chat/rooms')).key;
                    this.currentroomid = roomid;
                    this.currentcontact = contact;  
                    const chatsetup = [];
                    chatsetup.push(set(ref(db, "/chat/contacts/" + this.uid + "/" + contact.id), { room: roomid }));
                    chatsetup.push(set(ref(db, "/chat/contacts/" + contact.id + "/" + this.uid), { room: roomid }));
                    chatsetup.push(set(ref(db, "/chat/roomstatus/" + this.uid + "/" + roomid), { unread: 0 }));
                    chatsetup.push(set(ref(db, "/chat/roomstatus/" + contact.id + "/" + roomid), { unread: 0 }));                  
                    chatsetup.push(this.send("#MSGSSTARTINGPOINT#"));
                    
                    Promise.all(chatsetup).then(() => { 
                        this.getroomcontact(roomid, (contact) => { if (contact) { callback(contact) } })
                        let roomtemp = {}
                        roomtemp[roomid] = {}
                        this.rooms[roomid] ? delete this.rooms[roomid] : false;
                        Object.setontop(roomtemp, this.rooms)
                        onexists(contact)
                    })

                } else {
                    this.getcontact(contact.id, (mycontact) => {
                        if (mycontact) {
                            this.currentroomid = mycontact.val()[contact.id].room;
                            contact["room"] = mycontact.val()[contact.id].room;
                            this.currentcontact = contact;
                            //!if not in this.rooms
                            if (!this.rooms[mycontact.val()[contact.id].room]) {
                                callback(contact)
                            }

                            onexists(contact)
                        }
                    });
                }
            })
        } else { this.nouid() }
    }

    static async send(text = null) {
        if (this.uid) {
            let msgid = push(child(ref(db), '/chat/rooms')).key;
            await set(ref(db, "/chat/rooms/" + this.currentroomid + "/" + msgid), {
                text: text,
                sender: this.uid,
                seen: 0,
                date: serverTimestamp()
            }).then(() => {
                update(ref(db, "/chat/roomstatus/" + this.currentcontact.id + "/" + this.currentroomid), { unread: increment(1) })
            }).catch((r) => {  })
        }else{this.nouid()}
    }

    static getroomcontact(rid = null, callback = null) { 
        if (this.uid) {
            let recentPostsRef = query(ref(db, "/chat/contacts/" + this.uid), orderByChild("room"), equalTo(rid));
            get(recentPostsRef).then((contact) => {
                if (contact.exists()) {
                    callback(contact);
                } else { 
                    callback(null);
                }
            });
        } else { this.nouid() }
    }
    static getcontact(cid = null, callback = null) {
        if (this.uid) {
            let recentPostsRef = query(ref(db, "/chat/contacts/" + this.uid + "/" + cid));
            get(recentPostsRef).then((contact) => {
                if (contact.exists()) {
                    this.#reformatkeychild(contact);
                    callback(contact);
                } else {
                    callback(null);
                }
            });
        }else{this.nouid()}
    }

    static roomsstatuslisten(onupdatenewcontact = () => { }, toasttarget) {
        if (this.uid) {
            this.#closeroomsstatuslistener = onChildChanged(ref(db, "/chat/roomstatus/"+this.uid), (effectednode) => {
                
                if (Chat.chatuiopen) {
                    if (Object.hasOwn(this.rooms, effectednode.key)) {
                        
                        if (this.rooms[effectednode.key].obj)
                        this.rooms[effectednode.key].obj.updateunread = effectednode.val().unread;
                    } else {

                        this.getroomcontact(effectednode.key, (contact) => {
                            if (contact) {
                                onupdatenewcontact(contact);
                                let roomtemp = {}
                                roomtemp[effectednode.key] = {}
                                this.rooms[effectednode.key] ? delete this.rooms[effectednode.key] : false;
                                Object.setontop(roomtemp, this.rooms)
                            }
                        
                        })
                        
                    }
                } else {
                    if (effectednode.val().unread > 0) {
                        //!no working logic
                        if (Object.hasOwn(this.rooms, effectednode.key) && effectednode.val().unread < this.rooms[effectednode.key]?.obj?.unread) { return }
                        this.getroomcontact(effectednode.key, (contact) => {
                            if (contact) {
                                const minicontact = new Contact({ id: Object.keys(contact.val())[0], room: effectednode.key, unread: effectednode.val().unread }, this.uid, () => { }).create(Contact.displaymode.mini)
                                minicontact.then((mc) => {
                                    Toast.add("New message !", "just now", "&#xf27a;", "<!--unread messages : " + effectednode.val().unread + "-->", mc, 5000, () => {
                                    }, toasttarget)
                                })
                            }
                        });

                    }
                }
            }, (e) => { },
            {
                onlyOnce: false
            });
        } else { this.nouid() }
    }
    static closeroomsstatuslistener() {
        this.#closeroomsstatuslistener();
    }

    static onlinestatuslisten() { 
        if (this.uid) {
            this.#closeonlinestatuslisten = onChildChanged(ref(db, "/chat/online/"), (effectednode) => { 

                if (Object.hasOwn(this.online, effectednode.key)) {
                    this.online[effectednode.key].obj.updateonline = effectednode.val().online
                }
                this.getcontact(effectednode.key, (contact) => {
                    if (contact) {
                        if (Object.hasOwn(this.rooms, contact.val()[effectednode.key].room)) {
                            this.rooms[contact.val()[effectednode.key].room].obj.updateonline = effectednode.val().online
                        }
                    }
                })
            }, {
                onlyOnce: false
            });
        } else { this.nouid() }
    }
    static closeonlinestatuslisten() { 
        this.#closeonlinestatuslisten();
    }

    static msgslisten(lastid, callback) { 
        if (this.uid) {
                let recentPostsRef = null;
                if (lastid) {
                    recentPostsRef = query(ref(db, "/chat/rooms/" + this.currentroomid), orderByKey(), startAfter(lastid.toString()));
                } else { 
                    recentPostsRef = query(ref(db, "/chat/rooms/" + this.currentroomid));
                }
            this.#closemsgslistenadd = onChildAdded(recentPostsRef, (newnode) => {
                if (newnode.key == this.currentroomid) {
                    callback(newnode);
                } else {
                    this.#reformatkeychild(newnode);
                    callback(newnode);
                }
                },
                {
                    onlyOnce: false
                });
                
            this.#closemsgslistenchange = onChildChanged(ref(db, "/chat/rooms/" + Chat.currentroomid), (effectednode) => {
                if (Object.hasOwn(this.msgs, effectednode.key) && this.msgs[effectednode.key].obj.owen && effectednode.val().seen != undefined && effectednode.val().seen!="0") {
                    this.msgs[effectednode.key].obj.updateseen = true;
                }
            });
        } else { this.nouid() }    
    }
    static closemsgslisten() { 
        this.#closemsgslistenadd();
        this.#closemsgslistenchange();
    }

    static nouid = () => { }

    static #reformatkeychild = (snapshot) => { 
        let val = snapshot.val();
        snapshot.val = () => {
            let item = {};
            item[snapshot.key] = val;
            return item;
        }
    }
}