import Page from "./page.js";
import Product from "./product.js";
import Comment from "./comment.js";
import Routing from "./routing.js";
import Chat from "./chat.js";
import { orderByKey, equalTo } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getuser } from "./signed.js";
import { loginanimation } from "./navauthbtns.js";
import SYS from "./sys.js";

const commpool = document.getElementById("commpool");
const commentselected = document.getElementById("commentselected");
const selectedcommentname = document.getElementById("selectedcommentname");
const selectedcommrnttext = document.getElementById("selectedcommrnttext");
const closeselectedcomment = document.getElementById("closeselectedcomment");
const nocomment = document.getElementById("nocomment");

let uid = null;

Page.nouid = SYS.nouid
Product.nouid = SYS.nouid
Comment.nouid = SYS.nouid

getuser((id) => {
    uid = id;
    loadpage()
    if (id) {
        loginanimation(id);
        Chat.chatuiopen = false;
        Chat.uid = uid;
        Chat.setonline();
        Chat.roomsstatuslisten(() => { }, document.getElementById("alertpool"));
    }else { 
        Chat.closeroomsstatuslistener();
    }


})

let selectedcomment = null;

let pid = Routing.geturlparam().product;

let showproduct = null;
let showcomment = null;

async function loadpage() {

    showproduct && showproduct.empty();
    showcomment && (commpool.onscroll=() => { }) && showcomment.empty();
    

    const commentspath = "comments/" + pid;

    let recentPostsRef = { path: "Products", queryparams: [orderByKey(), equalTo(pid)] };
    showproduct = new Page("Products", Product, [uid, null], Product.displaymode.detiled, 0, recentPostsRef, document.getElementById("content"))
    showproduct.next(() => { }, () => { });

    showcomment = new Page(commentspath, Comment, [uid, selectcomment,false], Comment.displaymode.normal, 7, null, commpool)
    await showcomment.scrolldown(() => { nocomment.style.display="none" }, () => { });


    commpool.onscroll = async(e) => {
        const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
        if (e.target.scrollTop == max) {
            await showcomment.scrolldown(() => {  }, () => { },false,true,false);
        }
        else if (e.target.scrollTop == 0) {
            
            await showcomment.scrollup(() => { e.target.scrollTo(0,100)}, () => { }, true, false, false);
            
        }
        
    }

}

closeselectedcomment.addEventListener("click", function () { 
    commentselected.style.display = "none";
    selectedcomment = null;
})
function selectcomment(comment,parent,e) {
   e.stopPropagation();
    commentselected.style.display = "flex";
    selectedcomment = {};
    selectedcomment.path = comment.path;
    selectedcomment.cid = comment.id;
    selectedcomment.replaypool = comment.replaypool;
    selectedcomment.obj = parent;
    selectedcommentname.innerText = comment.sendername;
    selectedcommrnttext.textContent = comment.text;
}

const text = document.getElementById("comminput");
document.getElementById("sendcomm").addEventListener("click", () => {
    if (uid) {
        if (!selectedcomment) {
            Comment.send(pid, uid, text.value, selectcomment, showcomment)
        } else if (selectedcomment) {
            Comment.send(pid, uid, text.value, selectcomment, selectedcomment.obj, selectedcomment.path, selectedcomment.cid)
        }
        nocomment.remove();
        text.value = "";
    } else { Comment.nouid() }
});
