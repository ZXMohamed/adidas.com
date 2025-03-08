import Cookies from "./cookies.js";
import Routing from "./routing.js";
import { getallurl } from "./storageconfig.js";

const navloginbutton = document?.getElementById("navloginbutton");
const navsignbutton = document?.getElementById("navsignbutton");
const userphotobutton = document?.getElementById("userphotobutton");
const logoutbutton = document?.getElementById("logoutbutton");

if (navsignbutton) { 
    navsignbutton.addEventListener("click", function () { 
        Routing.goto(Routing.pages.signup, false);
        }
    )
}

if (navloginbutton) {
    navloginbutton.addEventListener("click", function () {
        //$set cookie to open login form 
        Cookies.setsession({ "openloginform": "true" });
        Routing.goto(Routing.pages.main, false);
        }
    )
}


export function loginanimation(uid) {
    navloginbutton.style.display = "none";
    navsignbutton.style.display = "none";
    userphotobutton.style.display = "flex";
    logoutbutton.style.display = "flex";

    userphotobutton.style.backgroundImage = "none";
    
    getallurl("/customerphoto/" + uid + "/photo", (urls) => {
        if (urls[0] != undefined) {
            userphotobutton.style.backgroundImage = `url(${urls[0]})`;
        } else { 
            userphotobutton.style.backgroundImage = "none";
        }
    });

}
