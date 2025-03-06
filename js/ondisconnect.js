import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import Toast from "./toast.js";

const db = getDatabase();


let conn = document.createElement("div");

    conn.innerHTML = `
        <div class="alert bg-success text-center text-white" style="font-family:symbols; role="alert">
            <span style="font-size:50px">&#xf1eb;</span><br>
            Connected
        </div>
    `;

let Nconn= document.createElement("div");

    Nconn.innerHTML = `
        <div class="alert bg-danger text-center text-white" style="font-family:symbols; role="alert">
            <span style="font-size:50px">&#xf1eb;</span><br>
            Not Connected
        </div>
    `;

const connectedRef = ref(db, ".info/connected");

setTimeout(() => {
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            
            Toast.add("Connection", undefined, "&#xf012;", "", conn, 5000, () => { },document.getElementById("alertpool"))
        } else { 
            Toast.add("Connection", undefined, "&#xf012;", "", Nconn, 5000, () => { },document.getElementById("alertpool"))
        }
    },{
        onlyOnce: false
    });
},3000)

