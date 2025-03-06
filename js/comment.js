import { getDatabase, ref, set, get, update, remove,push,child, increment } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getallurl } from "./storageconfig.js";
import Page from "./page.js";
const db = getDatabase();


export default class Comment extends Page{
    #currentcomment = {replaytarget:null}
    #data = { sendername: null, senderphoto: null }
    #showreplay = null;
    #uid = null;
    #event = null;
    #ondeletecomment = null;

    static displaymode = {
        normal: (comment) => {

            const commentcontent = document.createElement("div");
            commentcontent.classList.add("media","mb-2");
            commentcontent.innerHTML = (`
                    <div class="media-body">
                        <p style="width: 97%; font-size:14px;">${comment.#data.text}</p>
                        <div class="commreplay">

                        </div>
                    </div>
                `)
            
            const commentsendername = document.createElement("h6");
            commentcontent.firstElementChild.insertBefore(commentsendername, commentcontent.firstElementChild.firstElementChild);
            
            const commentsenderphoto = document.createElement("img");
            commentsenderphoto.style.width = "42.875px";
            commentsenderphoto.classList.add("me-3");
            commentsenderphoto.alt = "...";
            commentcontent.insertBefore(commentsenderphoto, commentcontent.firstElementChild);


            get(ref(db, "users/" + comment.#data.uid+"/name"))
                .then((snapshot) => {
                    //$toggle(add or remove)
                    if (snapshot.exists()) {
                        comment.#data.sendername = snapshot.val();
                        commentsendername.innerText = snapshot.val();
                    } else {
                        
                    }
                })
            getallurl("/customerphoto/" + comment.#data.uid + "/photo", (urls) => {
                comment.#data.senderphoto = urls[0]?urls[0]:"../photo/login.png";
                commentsenderphoto.src = urls[0] ? urls[0] : "../photo/login.png";
                commentsenderphoto.style.width = urls[0] ? "52.875px": "22.875px";
            })

            const love = document.createElement("span");
            love.style.cursor = "pointer";
            love.classList.add("love", "me-3");
            love.innerHTML = "&#xf004;" + " " + (comment.#data.loved ? comment.#data.loved : "0");
            if (comment.#uid) {
                get(ref(db, "loved" + comment.#data.path + "/" + comment.#uid))
                    .then((snapshot) => {
                        //$toggle(add or remove)
                        if (snapshot.exists()) {
                            love.classList.add("loved");
                        } else {
                            love.classList.remove("loved");
                        }
                    })
            }
            love.addEventListener("click", (e) => {
                if (comment.#uid) {
                    e.stopPropagation();
                    comment.togglelove();
                    love.classList.toggle("loved");
                } else { this.nouid() }

            })
            commentcontent.children[1].children[2].appendChild(love);
            
            let replaypoolid = "collapse"+comment.#data.id + comment.#data.path.replaceAll("/", "").replaceAll("-", "")
                
            let replay = document.createElement("span");
            replay.style.cursor = "pointer";
            replay.classList.add("replay");
            replay.setAttribute("data-bs-toggle", "collapse");
        
            replay.innerHTML = "&#xf4ad;";
            commentcontent.children[1].children[2].appendChild(replay);
            let bsCollapse;
            replay.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!bsCollapse) {
                    document.getElementById(replaypoolid).addEventListener('show.bs.collapse',  async(e)=> {
                        e.stopPropagation();
                        await comment.scrolldown(() => { }, () => { }, false, true, false)
                    });
                    document.getElementById(replaypoolid).addEventListener('hidden.bs.collapse',  (e)=> {
                        e.stopPropagation();
                        comment.reset();
                    });
                    bsCollapse = new bootstrap.Collapse(document.getElementById(replaypoolid));
                }
                bsCollapse.toggle();
            })
            
            
            comment.#currentcomment.replaytarget.id = replaypoolid;
            comment.#currentcomment.replaytarget.classList.add("collapse", "replaypool");
            commentcontent.children[1].appendChild(comment.#currentcomment.replaytarget);

            comment.#currentcomment.replaytarget.onscroll = async (e) => {
                const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
                if (e.target.scrollTop == max) {
                    await comment.scrolldown(() => { }, () => { }, false, true, false);
                }
                else if (e.target.scrollTop == 0) {

                    await comment.scrollup(() => { e.target.scrollTo(0, 100) }, () => { }, true, false, false);

                }

            }
           

            if (comment.#uid && comment.#data.uid == comment.#uid && comment.#uid && comment.#data.uid) {
                const menu = document.createElement("div");
                menu.classList.add("dropdown", "msgmenu")
                menu.innerHTML = (`
                        <ul class="dropdown-menu" style="font-family:'symbols';"></ul>
                    `)
                
                const commentmenubtn = document.createElement("button");
                commentmenubtn.classList.add("btn", "commentmenu");
                commentmenubtn.setAttribute("data-bs-toggle", "dropdown");
                commentmenubtn.innerHTML = "&#xf0c9;";
                
                menu.insertBefore(commentmenubtn, menu.children[0]);
                

                
                const deleteitem = document.createElement("li");
                deleteitem.classList.add("dropdown-item");
                deleteitem.innerHTML = "&#xf2ed; delete";
                deleteitem.addEventListener("click", function (e) {
                    e.stopPropagation();
                    comment.delete();
                   
                }, true);
                deleteitem.addEventListener("blur", function (e) {
                    e.stopPropagation();
                    menu.children[1].classList.remove("show");
                }, true);
                menu.children[1].appendChild(deleteitem);
               
                commentcontent.children[1].children[2].appendChild(menu);
            }

            comment.#data.replaypool = comment.#currentcomment.replaytarget;

            commentcontent.addEventListener("click", comment.#event.bind(null, comment.#data,comment));//*propagation direction child to parent

            return commentcontent;
        },
        replay: (comment) => {
            const commentcontent = this.displaymode.normal(comment);
            return commentcontent;
        }
    }

    constructor(data = {}, uid = null, click = null, isreplay = false, page = null) {
        const replaypool = document.createElement("div");
       
        super(data.path + "/has-replay/", Comment, [uid, click,true], Comment.displaymode.replay, 5, null, replaypool)
        this.#currentcomment.replaytarget = replaypool;
        
        this.#data = data;
        
        this.#uid = uid;
        this.#event = click;
        this.#currentcomment.isreplay = isreplay;

        this.#currentcomment.page = page;

    }

    togglelove() {
        
        get(ref(db, "loved" + this.#data.path +"/"+ this.#uid))
            .then((snapshot) => {
                
                if (snapshot.exists()) {
                    remove(ref(db, "loved" + this.#data.path + "/" + this.#uid))
                    update(ref(db, this.#data.path), { loved: increment(-1) })
                } else {
                    let rbody = {}
                    rbody[this.#uid] = true
                    update(ref(db, "loved" + this.#data.path), rbody)
                    update(ref(db, this.#data.path), { loved: increment(+1) })
                }

            }).catch((error) => { });
    }


    create(displaymode) {
        return displaymode(this)
    } 

    delete() { 

        remove(ref(db, this.#data.path)).then(() => { 

            this.#currentcomment.page.remove(this.#data.id);

            remove(ref(db, "loved"+this.#data.path));
        });
    }

    static send(pid = null, uid = null, text = "", event = null, page = null, replayon = null, cid = false) {
        if (uid) {
            let path = "";
            const data = {
                uid: uid,
                pid: pid,
                loved: 0,
                text: text,
                "replay-on": cid,
                "has-replay": false
            }
            replayon ? path = replayon + "/has-replay/" : path = "comments/" + pid + "/";
            const newcid = push(child(ref(db), path)).key;
            set(ref(db, path + newcid), data).catch((s) => {  });
            data.path = path + newcid;
            let comment = null;
            data["id"] = newcid;
            replayon ? comment = new this(data, uid, event, true,page) : comment = new this(data, uid, event,false,page );
            
            !replayon ? 
                page.outerinjectitem(newcid,comment, comment.create(Comment.displaymode.normal), true, false) :
                page.outerinjectitem(newcid,comment, comment.create(Comment.displaymode.replay), true, false);
                
    
        } else { this.nouid() }
    }

    static destroy(pageitem = {}) {
        pageitem.target.remove();
        pageitem.obj = null;
    }
    static nouid = () => { }
}