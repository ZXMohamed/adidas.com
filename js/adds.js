import { getDatabase, ref, set, get, update, remove, increment, query, startAt, orderByKey, endAt } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getallurl } from "./storageconfig.js";
import Routing from "./routing.js";
const db = getDatabase();

const newmodel = document.getElementById("newmodel");
const newproductp = document.getElementById("newproductp");
const newmodelvideo = document.getElementById("newmodelvideo");
const videomutebtn = document.getElementById("videomutebtn");
const newmodelname = document.getElementById("newmodelname");
const newmodelstat = document.getElementById("newmodelstat");

const des1arrow = document.getElementById("des1arrow");
const des2arrow = document.getElementById("des2arrow");
const des3arrow = document.getElementById("des3arrow");

const des1 = document.getElementById("des1");
const des2 = document.getElementById("des2");
const des3 = document.getElementById("des3");

const newmodelseemore = document.getElementById("newmodelseemore");


const addsbaner = document.getElementById("addsbaner");

export function mainpageadds() {
    getallurl("/adds/newmodel/photo", (urls) => {
        newmodel.style.backgroundImage = `url(${urls[0]})`;
        newproductp.style.backgroundImage = `url(${urls[0]})`;
    })
    getallurl("/adds/newmodel/video/poster", (urls) => {
        newmodelvideo.poster = urls[0];
    })
    getallurl("/adds/newmodel/video/video", (urls) => {
        newmodelvideo.src = urls[0];
        newmodelvideo.play();
    })
    videomutebtn.addEventListener("click", () => {
        if (newmodelvideo.muted) {
            newmodelvideo.muted = false;
            videomutebtn.innerHTML = "&#xf6a9;";
        } else {
            newmodelvideo.muted = true;
            videomutebtn.innerHTML = "&#xf028;";

        }
    })
    get(ref(db, "adds/newmodel"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                newmodelname.innerText = snapshot.val().name;

                for (const key in snapshot.val().Statistics) {
                    newmodelstat.innerHTML += `
                                    <div>
                                        <div>
                                            <div>
                                                <div id="newmodelstatval">${snapshot.val().Statistics[key]}</div>
                                            </div>
                                        </div>
                                        <span id="newmodelstatname">${key}</span>
                                    </div>
                    `
                }
                newmodelstat.innerHTML += "<aside></aside>";

                des1arrow.style.display="inline";
                des2arrow.style.display="inline";
                des3arrow.style.display="inline";

                des1.innerText = snapshot.val().description.des1;
                des2.innerText = snapshot.val().description.des2;
                des3.innerText = snapshot.val().description.des3;

                newmodelseemore.addEventListener("click", () => {
                    Routing.goto(Routing.pages.show, false, Routing.seturlparam({
                        "product": snapshot.val().pid
                    }))  
                })
            } else {
                
            }
        })

}

export function storeadds() {
    //$get slider photos
    //$loop to set slider photos
    getallurl("/adds/Banner", (urls) => {
        for (const url of urls) {
            addsbaner.innerHTML += `
                <div class="carousel-item">
                    <img src="${url}" class="d-block w-100" alt="...">
                </div>
            `
        }
        addsbaner.children[0].classList.add("active");
    })
}


window.onscroll = () => {
    if (window.scrollY > 3500) {
        newmodelvideo.play();
    }
}