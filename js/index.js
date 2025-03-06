import { app } from "./serverconfig.js";
import { mainpageadds } from "./adds.js";
import Chat from "./chat.js";
import Page from "./page.js";
import Partners from "./partners.js";
import Product from "./product.js";
import Routing from "./routing.js";
import { getuser } from "./signed.js";
import SYS from "./sys.js";
import { getallurl } from "./storageconfig.js";

let uid = null;

let last = null;

Page.nouid = SYS.nouid
Product.nouid = SYS.nouid


getuser((id) => {
    uid = id; 
    
    loadpage();

    if (id) {
        loginanimation(id);
        Chat.chatuiopen = false;
        Chat.uid = uid;
        Chat.setonline();
        Chat.roomsstatuslisten(() => {}, document.getElementById("alertpool"));
        
    } else { 
        Chat.closeroomsstatuslistener();
    }

})

function loadpage() {
    if (last) { 
        last.empty();
    }

    last = new Page("Products", Product, [uid, (product) => { Routing.goto(Routing.pages.show, false, Routing.seturlparam({ "product": product.id })) }], Product.displaymode.normal, 9, null, document.getElementById("laststyles"))
    last.next(() => { }, () => { });
}
    
let partners = new Page("Partners", Partners, [null], Partners.displaymode.normal, 8, null, document.getElementById("ourpartners"))

partners.next(() => { }, () => { })



mainpageadds()


const forgetpassword = document.getElementById("forgetpassword");
forgetpassword.addEventListener("click", function () {
    Routing.goto(Routing.pages.manageaccount + Routing.seturlparam({ "function": "forget_password" }))
})


function loginanimation(uid) {
    navloginbutton.style.display = "none";
    navsignbutton.style.display = "none";
    userphotobutton.style.display = "flex";
    logoutbutton.style.display = "flex";


    getallurl("/customerphoto/" + uid + "/photo", (urls) => {
        if (urls[0] != undefined) {
            userphotobutton.style.backgroundImage = `url(${urls[0]})`;
        }
    });
}
