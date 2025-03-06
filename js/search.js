import Page from "./page.js";
import Product from "./product.js";
import Routing from "./routing.js";
import {  orderByChild, startAt, endAt } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";


const searchinput = document.getElementById("searchinput");
const searchdropdownlist = document.getElementById("searchdropdownlist");
const searchfilterlist = document.getElementById("searchfilterlist").children;
const searchbtn = document.getElementById("search");


let searchfilter = "name";
let result;
let recentPostsRef;
let searchdropdown = new bootstrap.Dropdown(document.getElementById("searchdropdownlist"));
let searchlock = false;

searchbtn.addEventListener("click", getresults)
searchinput.addEventListener("change", getresults)

function getresults(e) {
    if (!searchlock) {
        searchlock = true;
        result?.empty();
        e.stopPropagation();
    
        if (searchinput.value.trim() == "") {
            searchdropdownlist.innerHTML = "";
        }
        else {
            if (isNaN(searchinput.value)) {
                recentPostsRef = { path: "Products", queryparams: [orderByChild(searchfilter), startAt(searchinput.value), endAt(searchinput.value + "\uf8ff")] };
            }
            else {
                recentPostsRef = { path: "Products", queryparams: [orderByChild(searchfilter), equalTo(parseFloat(searchinput.value))] };
            }

            while (searchdropdownlist.lastElementChild) {
                searchdropdownlist.removeChild(searchdropdownlist.lastElementChild);
            }
            result = null;
            result = new Page("Products", Product, [null, (product) => { Routing.goto(Routing.pages.show, false, Routing.seturlparam({ "product": product.id })) }], Product.displaymode.search, 0, recentPostsRef, document.getElementById("searchdropdownlist"))
            result.next(() => {
                searchdropdown.show();
                searchlock = false;
           
            }, notfound)
        }
    }

}


function notfound() {
    result.empty();
    filtrtype();
    const nothingitem = document.createElement("button");
    const nosthingword = document.createElement("span");
    const dline = document.createElement("div");

    nosthingword.innerText = "No Thing Here !";

    dline.classList.add("dropdown-divider");
    nothingitem.classList.add("dropdown-item");
    nothingitem.classList.add("searchdropdownnoitem");
    nothingitem.classList.add("searchdropdownitem");

    searchdropdownlist.appendChild(dline);
    nothingitem.appendChild(nosthingword);
    searchdropdownlist.appendChild(nothingitem);
    searchdropdown.show();
    searchlock = false;
}


filtrtype();
function filtrtype() {
    const searchbyitem = document.createElement("button");
    const searchby = document.createElement("span");

    searchby.innerText = "Search by : " + searchfilter;

    searchbyitem.classList.add("dropdown-item");
    searchbyitem.classList.add("searchdropdownnoitem");
    searchbyitem.classList.add("searchdropdownitem");

    searchbyitem.appendChild(searchby);
    searchdropdownlist.appendChild(searchbyitem);
}

for (var i = 0; i < searchfilterlist.length; i++) {
    searchfilterlist[i].addEventListener("click", function (e) {
        searchfilter = e.target.value;
        searchdropdownlist.innerHTML = "";
        filtrtype();
    })
}



searchdropdownlist.addEventListener('hide.bs.dropdown', event => {
    result.empty();
})