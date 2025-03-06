import { app } from "./serverconfig.js";
import { getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import Routing from "./routing.js";
import { getallurl } from "./storageconfig.js";
import Cookies from "./cookies.js";

const auth = getAuth();


const pageFunction = Routing.geturlparam()["function"];

const signupconheader = document.getElementById("signupconheader");
const signupwith = document.getElementById("signupwith");

const accountform = document.getElementById("accountform");
const email = document.getElementById("email");
const emailpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const accountformmsg = document.getElementById("accountformmsg");
const Verify = document.getElementById("Verify");

const navloginbutton = document.getElementById("navloginbutton");
const logoutbutton = document.getElementById("logoutbutton");
const userphotobutton = document.getElementById("userphotobutton");

switch (pageFunction) {
    case "verify_email":
       emailverify();
        break;
    
    case "forget_password":
        forgetpassword();
        break;

    default:
        break;
}

let userdata;

function emailverify() {

    onAuthStateChanged(auth, (user) => {       
        if (user) {

            userdata = user;

            signupconheader.innerText = "Verify email";
            signupwith.innerHTML = `Please verify your <br> email address <i><u>${user.email}</u></i> <br>  by clicking Verify then click the link sent to your <br> email address.`;
            logoutbutton.style.display = "flex";
            userphotobutton.style.display = "flex";
            navloginbutton.style.display = "none";
            stepscon.style.visibility = "visible";
            accountform.style.display = "flex";
            email.disabled = true;
            email.value = user.email;
            Verify.style.display = "flex";

            getallurl("/customerphoto/" + user.uid + "/photo", (urls) => {
                if (urls[0] != undefined) {
                    userphotobutton.style.backgroundImage = `url(${urls[0]})`;
                } else { 

                }
            });

            Verify.addEventListener("click", emailverifyevent);
        } else {
            Routing.goto(Routing.pages.signup, true);
        }
    });

}


function emailverifyevent() {
    sendEmailVerification(userdata)
        .then(() => {

            //^
            Cookies.setcookies({ sitetype: { value: "js", expires: "Thu, 18 Dec 2030 12:00:00 UTC" } })
            //^

            accountformmsg.innerText = "Email verification sent!";
            accountformmsg.style.color = "#2cff05";
            resendtimer(emailverifyevent);
        }
    );
}


function forgetpassword() {


    signupconheader.innerText = "Forget Password";
    signupwith.innerHTML = `you can rest your password but first verify your email \n so please enter your email`;

    stepscon.style.visibility = "visible";
    accountform.style.display = "flex";

    Verify.style.display = "flex";

    navloginbutton.style.display = "flex";


    Verify.addEventListener("click", forgetpasswordevent)

}


function forgetpasswordevent() {
    if (confirmedemail()) {
        sendPasswordResetEmail(auth, email.value)
            .then(() => {

                //^
                Cookies.setcookies({ sitetype: { value: "js", expires: "Thu, 18 Dec 2030 12:00:00 UTC" } })
                //^
                
                accountformmsg.innerText = "Email verification sent!";
                accountformmsg.style.color = "#2cff05";
                resendtimer(forgetpasswordevent);
            })
            .catch((error) => {
                const errorCode = error;
                alert(errorCode);
            }
        );
    }
}




function resendtimer(event) {
    Verify.removeEventListener("click", event);
    let timeleft = 60;
    Verify.innerHTML = "Resend after " + timeleft + "s";
    let resendtimer = setInterval(() => {
        if (timeleft <= 0) {
            clearInterval(resendtimer);
            Verify.innerHTML = "Resend";
            Verify.addEventListener("click", event);
        } else {
            Verify.innerHTML = "Resend after " + timeleft + "s";
        }
        timeleft -= 1;
    }, 1000);
}

email.addEventListener("change", function () {
    confirmedemail();
})

function confirmedemail() {
    if (email.value.match(emailpattern)) {
        email.style.color = "#94a8c4";
        return true;
    }
    else {
        email.style.color = "red";
    }
}

navloginbutton.addEventListener("click", function () {
    Cookies.setsession({ "openloginform": "true" });
    Routing.goto(Routing.pages.main, false);
    }
)

const stepnum1 = stepscon.children[1];
stepnum1.style.filter = "opacity(100%)";
stepnum1.children[0].style.filter = "opacity(100%)";
stepnum1.children[0].children[0].style.filter = "opacity(100%)";