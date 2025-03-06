import Routing from "./routing.js";
import { app } from "./serverconfig.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
const auth = getAuth(app);

const navloginbutton = document.getElementById("navloginbutton");
const navsignbutton = document.getElementById("navsignbutton");
const userphotobutton = document.getElementById("userphotobutton");
const logoutbutton = document.getElementById("logoutbutton");

logoutbutton.addEventListener("click", function () {
    signOut(auth).then(() => {
        Routing.geturlparam()["function"] == "verify_email" ?
        Routing.goto(Routing.pages.main, true):
        loginanimation();
    }).catch((error) => {

    });
})

function loginanimation() {
    navloginbutton.style.display = "flex";
    navsignbutton.style.display = "flex";
    userphotobutton.style.display = "none";
    logoutbutton.style.display = "none";
}