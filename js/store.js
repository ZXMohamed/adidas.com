import { app } from "./serverconfig.js";
import { storeadds } from "./adds.js";
import Filter from "./filter.js";
import Chat from "./chat.js";
import { loginanimation } from "./navauthbtns.js";
import Page from "./page.js";
import Product from "./product.js";
import { initrange,resetrange } from "./range.js";
import Routing from "./routing.js";
import { getuser } from "./signed.js";
import SYS from "./sys.js";
import { Ntheme, selectedmode } from "./mode.js";

const next = document.getElementById("next");
const back = document.getElementById("back");

let uid = null;

Filter.nouid = SYS.nouid
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
    }else { 
        Chat.closeroomsstatuslistener();
    }
})

storeadds();


let store;
function loadpage() {
    if (store) { 
        store.empty();
    }
    store = new Filter("Products", Product, [uid, (product) => { Routing.goto(Routing.pages.show, false, Routing.seturlparam({ "product": product.id })) }], Product.displaymode.normal, 15, null, document.getElementById("products"), true)
    store.next(() => { }, () => { })
    filterreset();
}
next.addEventListener("click", function () {
    store.next(() => { window.scrollTo(0, 0); }, () => { });
})

back.addEventListener("click", function () {
    store.prev(() => { window.scrollTo(0, 0); }, () => { });
})



const gfiltermen = document.getElementById("gfiltermen");
const gfilterwomen = document.getElementById("gfilterwomen");
const sizefilter = document.getElementById("sizefilter");

const colorfilterpeeker = document.getElementById("colorfilterpeeker").children;
const pricefilterfromvalue = document.getElementById("pricefilterfromvalue");
const pricefiltertovalue = document.getElementById("pricefiltertovalue");



let selectedcolor;


gfiltermen.onchange = function () {
    store.filters.category.men.value = gfiltermen.checked;
    store.get(()=>{},()=>{},[],Filter.empty.nav,true);

}
gfilterwomen.onchange = function () {
    store.filters.category.women.value = gfilterwomen.checked;
    store.get(()=>{},()=>{},[],Filter.empty.nav,true);
}

sizefilter.onmouseup = function () {
    store.filters.size.value = sizefilter.value;
    store.get(()=>{},()=>{},[],Filter.empty.nav,true);
}

initrange("slider-range", 0, 500,
    async (e, ui) => {
        store.filters.price.range.from = ui.values[0];
        store.filters.price.range.to = ui.values[1];
        await store.get(() => { }, () => { }, [], Filter.empty.nav, true);
    },
    async (e, ui) => {
        pricefilterfromvalue.innerText = ui.values[0] + "$";
        pricefiltertovalue.innerText = ui.values[1] + "$";
    });

for (const colorbtn of colorfilterpeeker) {
    colorbtn.addEventListener("click", function () {
        colorbtn.classList.toggle("dropcolor");
        let r = selectedcolor.indexOf(this.getAttribute("value"))
        if (r > -1) {
            selectedcolor.splice(r, 1);
        } else {
            selectedcolor.push(this.getAttribute("value"));
        }
        store.get(() => { }, () => { }, [], Filter.empty.nav, true);
    })
}

const filterReset = document.getElementById("filterReset");
filterReset.addEventListener("click", filterreset)

function filterreset() {
    store.filters.category.men.value = true;
    store.filters.category.women.value = true;
    store.filters.price.range.from = "0";
    store.filters.price.range.to = "500";
    store.filters.size.value = "30";
    selectedcolor = ['red', 'white', 'blue', 'green', 'violet', 'black', 'yellow', 'blueviolet', 'brown', 'orangered'];
    store.filters.color.value = selectedcolor;

    gfiltermen.checked = true;
    gfilterwomen.checked = true;
    sizefilter.value = 30;

    resetrange("slider-range");
    pricefilterfromvalue.innerText = store.filters.price.range.from + "$";
    pricefiltertovalue.innerText = store.filters.price.range.to + "$";


    for (const colorbtn of colorfilterpeeker) {
        colorbtn.classList.remove("dropcolor");
    }
}

document.getElementById("filtermode").addEventListener("click", () => {
    Ntheme.next();
})

window.onscroll = () => {
    if (window.scrollY > 768) {
        document.getElementsByClassName("products")[0].style.backgroundColor = "var(--secbg)";
        document.getElementsByClassName("productscon")[0].style.background = "none";
        document.getElementsByClassName("filtermenucon")[0].children[0].style.color = "var(--title)";
    } else if (window.scrollY < 768) {
        selectedmode == "dark" ? document.getElementsByClassName("filtermenucon")[0].children[0].style.color = "white" :
                        document.getElementsByClassName("filtermenucon")[0].children[0].style.color = "black";
        document.getElementsByClassName("products")[0].style.backgroundColor = "unset";
        document.getElementsByClassName("productscon")[0].style.background = "linear-gradient(180deg,rgba(255, 255, 255, 0) 0px,var(--secbg) 280px 100%)";
    }
}