import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset, applyActionCode } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import Routing from"./routing.js"
import Cookies from "./cookies.js";

  const config = {
      'apiKey': "AIzaSyC9f4OQuNH4pDerdufunmgM34CfOf9zeX0"
  };
  
const app = initializeApp(config);
const auth = getAuth(app);


let params = Routing.geturlparam(); console.table(params);
const mode = params['mode'];

const actionCode = params['oobCode'];
const continueUrl = params['continueUrl'];
const lang = params['lang'] || 'en';

const signupconheader = document.getElementById("signupconheader");
const signupwith = document.getElementById("signupwith");
const password = document.getElementById("password");
const confirmpassword = document.getElementById("confirmpassword");
const passwordform = document.getElementById("passwordform");

const stepscon = document.getElementById("stepscon");


const next= document.getElementById("next");
    
  switch (mode) {
    case 'resetPassword':

      handleResetPassword(auth, actionCode, continueUrl, lang);
      break;

    case 'verifyEmail':
      
      handleVerifyEmail(auth, actionCode, continueUrl, lang);
      break;
    default:

  }

function handleResetPassword(auth, actionCode, continueUrl, lang) {

    signupconheader.innerText = "Reset Password";
    signupwith.innerText = "Write the new password and confirm it then click next";
    passwordform.style.display = "flex";
    stepscon.style.visibility = "visible";
    next.innerText = "Reset";
    next.style.display = "flex";

    verifyPasswordResetCode(auth, actionCode).then((email) => {

        const accountEmail = email;

        next.addEventListener("click", () => {
            
            if(confirmedpass()){
            const newPassword = password.value;

            confirmPasswordReset(auth, actionCode, newPassword).then((resp) => {

                //^
                if (Cookies.getcookies()[" sitetype"] == "js") {
                    Cookies.setsession({ "openloginform": "true" });
                    Routing.goto(Routing.pages.main, true);
                } else { 
                    location.replace("https://adidas-shop-95690.web.app/")
                }

            }).catch((error) => {console.log(error);
            
            });
        }
        })


    }).catch((error) => {
   
    });
}

function handleVerifyEmail(auth, actionCode, continueUrl, lang) {

    signupconheader.innerText = "Verify Email";
    signupwith.innerText = `Email Verified !`;
    passwordform.style.display = "none";
    stepscon.style.visibility = "hidden";
    next.innerText = "Back to Store";
    next.style.display = "flex";

    applyActionCode(auth, actionCode).then((resp) => {

        next.addEventListener("click", () => {

            //^
            if (Cookies.getcookies()[" sitetype"] == "js") {
                Routing.goto(Routing.pages.main, true);
            } else { 
                location.replace("https://adidas-shop-95690.web.app/")
            }
            
        });

    }).catch((error) => {
       
    });
}

const showpass = document.getElementsByClassName("showpassbtn");
for (var i = 0; i < showpass.length; i++) {
    showpass[i].addEventListener("click", function () {
        if (this.nextElementSibling.getAttribute("type") == "password") {
            this.innerHTML = "&#xf06e;";
            this.nextElementSibling.setAttribute("type", "text");
        }
        else if (this.nextElementSibling.getAttribute("type") == "text") {
            this.innerHTML = "&#xf070;";
            this.nextElementSibling.setAttribute("type", "password");
        }
    });
}

const pattrnmsg = document.getElementById("pattrnmsg");
const passpattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

function confirmedpass() {
    if (password.value.trim() == confirmpassword.value.trim() && password.value.match(passpattern)) {
        return true;
    }
    else if (!(password.value.match(passpattern)) && password.value == "") {
        pattrnmsg.style.color = "#94a8c4";
        return false;
    }
    else if (!(password.value.match(passpattern))) {
        pattrnmsg.style.color = "red";
        return false;
    }
    else {
        confirmpassword.style.color = "red";
        passmsg.innerHTML = "please match the password below";
        passmsg.style.color = "red";
        return false;
    }
}

password.addEventListener("keyup", function () {

    if (!(password.value.match(passpattern)) && password.value.trim() == "") {
        pattrnmsg.style.color = "#94a8c4";
    }
    else if (!(password.value.match(passpattern))) {
        pattrnmsg.style.color = "red";
    }
    else {
        pattrnmsg.style.color = "#94a8c4";
    }
})

confirmpassword.addEventListener("keyup", function () {
    if (password.value == confirmpassword.value && password.value.trim() != "" && confirmpassword.value.trim() != "") {
        confirmpassword.style.color = "#333F50";
        passmsg.innerHTML = "well done :)";
        passmsg.style.color = "#94a8c4";
    }
    else if (password.value.trim() == confirmpassword.value.trim()) {
        confirmpassword.style.color = "#333F50";
    }
    else {
        confirmpassword.style.color = "red";
        passmsg.innerHTML = "please match the password below";
        passmsg.style.color = "red";
    }
})


const stepnum1 = stepscon.children[1];
stepnum1.style.filter = "opacity(100%)";
stepnum1.children[0].style.filter = "opacity(100%)";
stepnum1.children[0].children[0].style.filter = "opacity(100%)";