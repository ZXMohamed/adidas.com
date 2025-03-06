import Cookies from "./cookies.js";
import Routing from "./routing.js";
import { app } from "./serverconfig.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import Toast from "../clintserv/toast.js";
const auth = getAuth(app);
let sessiontype = browserSessionPersistence;

const navloginbutton = document.getElementById("navloginbutton");
const navsignbutton = document.getElementById("navsignbutton");
const userphotobutton = document.getElementById("userphotobutton");
const logoutbutton = document.getElementById("logoutbutton");

const headersec = document.getElementById("headersec");
const headerbackphoto = document.getElementById("headerbackphoto");

const email = document.getElementById("email");
const password = document.getElementById("password");
const showpass = document.getElementById("showpassbtn");
const gosignbutton = document.getElementById("gosignbutton");
const loginbutton = document.getElementById("loginbutton");
const rememberme = document.getElementById("rememberme");

let userdata = {
    email: null,
    password: null
}

rememberme.addEventListener("change", function () {
    if (rememberme.checked) {
        sessiontype = browserLocalPersistence;
    } else { 
        sessiontype = browserSessionPersistence;
    }
})

loginbutton.addEventListener("click", function () {

    userdata.email = email.value
    userdata.password = password.value

    if (validat(userdata)) {
        setPersistence(auth, sessiontype).then(() => {
        signInWithEmailAndPassword(auth, userdata.email, userdata.password)
            .then((userCredential) => {
                const user = userCredential.user;
                email.value = "";
                password.value = "";
                if (!user.emailVerified) {
                    Routing.goto(Routing.pages.manageaccount + Routing.seturlparam({ "function": "verify_email" }), true);
                } else {
                    loginformtoggle();
                }
            })
            .catch((error) => {
                Toast.add("account", undefined, "&#xf2bb;", "login failed check your email or password", null, 10000, () => {}, document.getElementById("alertpool"));
            });
        })
        .catch((error) => {

        });
    }
})

function validat(userdata) {
    if (userdata.email != null && userdata.email.trim() != "" && userdata.password != null && userdata.password.trim() != "") {
        return true;
    }
    else {
        return false;
    }
}

function loginformtoggle() {
    headersec.classList.toggle("onheaderseclog");
    headerbackphoto.classList.toggle("onheaderbackphotolog");
}
function gosign() {
    Routing.goto(Routing.pages.signup);
}
showpass.addEventListener("click", function () {
    if (this.nextElementSibling.getAttribute("type") == "password") {
        this.innerHTML = "&#xf06e;";
        this.nextElementSibling.setAttribute("type", "text");
    }
    else if (this.nextElementSibling.getAttribute("type") == "text") {
        this.innerHTML = "&#xf070;";
        this.nextElementSibling.setAttribute("type", "password");
    }
});


navsignbutton.addEventListener("click", gosign)
gosignbutton.addEventListener("click", gosign)

navloginbutton.addEventListener("click", loginformtoggle);

Cookies.getcookies()[" openloginform"] == "true" ? loginformtoggle() : false;

Cookies.setsession({"openloginform":"false"});

window.onscroll = () => {
    if (window.scrollY > 168) {
        headersec.classList.remove("onheaderseclog");
        headerbackphoto.classList.remove("onheaderbackphotolog");
    }
}