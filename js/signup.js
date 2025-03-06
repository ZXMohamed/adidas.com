import Cookies from "./cookies.js";
import Routing from "./routing.js";

import { app } from "./serverconfig.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getStorage, ref as stref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";
import { storage } from "./storageconfig.js";
import { getuser } from "./signed.js";
import Toast from "./toast.js";

let newaccount = false;


getuser((id) => {
    id && !newaccount ? Routing.goto(Routing.pages.main) : false;
})

const auth = getAuth(app);
const db = getDatabase();




const wating = document.getElementById("wating");
let progress;


const stepscon = document.getElementById("stepscon");
const stepsbar = document.getElementById("stepsbar");
const stepnum1 = stepscon.children[1];


const forms = document.getElementsByTagName("main");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const age = document.getElementById("age");
const sex = document.getElementById("sex");
const country = document.getElementById("country");
const city = document.getElementById("city");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmpassword = document.getElementById("confirmpassword");
const showpass = document.getElementsByTagName("i");
const pattrnmsg = document.getElementById("pattrnmsg");
const passmsg = document.getElementById("passmsg");
const photoselector = document.getElementById("photoselector");
const userphoto = document.getElementById("userphoto");


const next = document.getElementById("next");
const prev = document.getElementById("pre");


let seek = 1;
let seekmax = 4;
let currentpage = 1;


let optionsnav = 0;
let countries = [];
let inx = 0;


let stepsbarwidth = 0;
let stepnum;


const passpattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
const emailpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


const gologin = document.getElementById("gologin");




stepnum1.style.filter = "opacity(100%)";
stepnum1.children[0].style.filter = "opacity(100%)";
stepnum1.children[0].children[0].style.filter = "opacity(100%)";


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

fetch("../json/countries+states.json")
    .then(response => response.json())
    .then(result => {
        for (i of result) {

            let listitems = document.createElement("option");
            listitems.innerHTML = i.name;
            listitems.value = inx;
            countries.push(i);
            country.appendChild(listitems);

            inx++;
        }
    });





function navnext() {
    currentpage = seek;
    return seek + 1 <= seekmax ? seek += 1 : false;
}
function navprev() {
    currentpage = seek;
    return seek - 1 >= 1 ? seek -= 1 : false;
}
function navshow() {

    forms[currentpage].style.display = "none";
    forms[seek].style.display = "flex";
}
function navsteps() {
    stepnum = stepscon.children[seek];
    stepnum.style.filter = "opacity(100%)";
    stepnum.children[0].style.filter = "opacity(100%)";
    stepnum.children[0].children[0].style.filter = "opacity(100%)";

    stepsbarwidth = (35 * (seek - 1));
    stepsbar.style.width = stepsbarwidth + "%";

    if ((seek + 1) <= seekmax) {
        stepnum = stepscon.children[seek + 1];
        stepnum.style.filter = "opacity(50%)";
        stepnum.children[0].style.filter = "opacity(50%)";
        stepnum.children[0].children[0].style.filter = "opacity(50%)";
    }
}




next.addEventListener("click", function () {
    if (validate(seek)) {
        let r = navnext();
        if (r == seekmax) {
            navshow();
            navsteps();
            next.innerHTML = "Signup";
        } else if (r !== false) {
            navshow();
            navsteps();
        } else {
            newaccount = true;

            let userdata = {
                firstname: firstname.value,
                lastname: lastname.value,
                age: age.value,
                sex: sex.value,
                country: country.value,
                city: city.value,
                email: email.value,
                password: password.value,
                userphoto: photoselector.files[0]
            }
            .log(userdata);
            createUserWithEmailAndPassword(auth, userdata.email, userdata.password)
                .then(() => {
                    const uploads = [];
                    wating.style.display = "flex";

                    uploads.push(set(ref(db, "users/" + auth.currentUser.uid), {
                        age: userdata.age,
                        gender: userdata.sex,
                        country: userdata.country,
                        city: userdata.city,
                        name: userdata.firstname + " " + userdata.lastname
                    }));

                    if (userdata.userphoto) {
                        const storageRef = stref(storage, "/customerphoto/" + auth.currentUser.uid + "/photo/" + userdata.userphoto.name);
                        const uploadTask = uploadBytesResumable(storageRef, userdata.userphoto);
                        uploads.push(uploadTask);
                        uploadTask.on('state_changed',
                            (snapshot) => {

                            },
                            (error) => {

                            },
                            (op) => {
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {


                                    //*unnecessary
                                    updateProfile(auth.currentUser, {
                                        displayName: userdata.firstname + " " + userdata.lastname,
                                        photoURL: downloadURL
                                    }).then(() => {

                                    }).catch((error) => {

                                    });
                                });
                            }
                        );
                    }
                    else {

                    }
                    Promise.all(uploads).then(() => {
                        wating.style.display = "none";
                        Routing.goto(Routing.pages.manageaccount + Routing.seturlparam({ "function": "verify_email" }), true);

                    }).catch((e) => { })
                })
                .catch((error) => {
                    Toast.add("account", undefined, "&#xf2bb;", "signup failed", null, 10000, () => { }, document.getElementById("alertpool"));
                    wating.style.display = "none";
                });
        }
    } else {

    }
})


prev.addEventListener("click", function () {
    if (navprev() !== false) {
        navshow();
        navsteps();
        next.innerHTML = "Next";
    } else {

    }
})




function validate(seek) {
    if (seek == 1) {
        if (firstname.value != null && lastname.value != null && firstname.value.trim() != "" && lastname.value.trim() != "")
            return true;
    }
    else if (seek == 2) {
        if (confirmedemail())
            return true;
    }
    else if (seek == 3) {
        if (confirmedpass())
            return true;
    }
    else if (seek == 4) {
        return true;
    }

    return false;
}
function confirmedemail() {
    if (email.value.match(emailpattern)) {
        email.style.color = "#94a8c4";
        return true;
    }
    else {
        email.style.color = "red";
    }
}
function confirmedpass() {
    if (password.value == confirmpassword.value && password.value.match(passpattern)) {
        return true;
    }
    else if (!(password.value.match(passpattern)) && password.value == "") {
        pattrnmsg.style.color = "#94a8c4";
    }
    else if (!(password.value.match(passpattern))) {
        pattrnmsg.style.color = "red";
    }
    else {
        confirmpassword.style.color = "red";
        passmsg.innerHTML = "please match the password below";
        passmsg.style.color = "red";
        return null;
    }
}


country.addEventListener("change", function () {

    city.children[1]?.remove();
    city.removeAttribute("disabled");
    city.value = "0";
    let itemsgroup = document.createElement("optgroup");
    let selectedcountry = countries[country.children[this.selectedIndex].value];
    itemsgroup.setAttribute("label", selectedcountry.name);
    city.appendChild(itemsgroup);
    for (i of selectedcountry.states) {
        let listitems = document.createElement("option");
        listitems.innerHTML = i.name;
        itemsgroup.appendChild(listitems);
    }

})
city.addEventListener("change", function () {

})
email.addEventListener("change", function () {
    confirmedemail();
})
password.addEventListener("keyup", function () {

    if (!(password.value.match(passpattern)) && password.value == "") {
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
    if (password.value == confirmpassword.value && password.value != "" && confirmpassword.value != "") {
        confirmpassword.style.color = "#333F50";
        passmsg.innerHTML = "well done :)";
        passmsg.style.color = "#94a8c4";
    }
    else if (password.value == confirmpassword.value) {
        confirmpassword.style.color = "#333F50";
    }
    else {
        confirmpassword.style.color = "red";
        passmsg.innerHTML = "please match the password below";
        passmsg.style.color = "red";
    }
})
photoselector.addEventListener("change", function () {
    let photo = photoselector.files[0];
    let filereader = new FileReader();
    filereader.readAsDataURL(photo);
    filereader.onload = function () {
        userphoto.src = filereader.result;

    }
})





gologin.addEventListener("click", function () {
    Cookies.setsession({ "openloginform": "true" });
    Routing.goto(Routing.pages.main, false);
})

