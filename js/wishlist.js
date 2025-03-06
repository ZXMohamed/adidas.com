import { app } from "./serverconfig.js";
import Page from "./page.js";
import Product from "./product.js";
import Routing from "./routing.js";
import { getuser } from "./signed.js";
import SYS from "./sys.js";

const headertitle = document.getElementById("headertitle");
const noproduct = document.getElementById("noproduct");

let uid = null;
Page.nouid = SYS.nouid;
Product.nouid = SYS.nouid;
getuser((id) => {
    uid = id; 
    loadpage()
})

let pagefunction = Routing.geturlparam()["function"];

function loadpage() {

    switch (pagefunction) {
        case "wish_list":
            wishlist();
            break;
        case "cart":
            cart();
            break;
        default:
            break;
    }

}
const products = document.getElementById("products");
function wishlist() {
    headertitle.innerHTML = "Wish list";
    if (uid) {
        let last = new Page("users/" + uid + "/love", Product, [uid, (product) => { Routing.goto(Routing.pages.show, false, Routing.seturlparam({ "product": product.id })) }], Product.displaymode.referenced, 9, null, products)
        last.scrolldown(() => { noproduct.style.display="none" }, () => { })
        products.onscroll = async (e) => {
            const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
            if (e.target.scrollTop == max) {
                await last.scrolldown(() => { }, () => { }, false, true, false);
            }
            else if (e.target.scrollTop == 0) {

                await last.scrollup(() => { e.target.scrollTo(0, 100) }, () => { }, true, false, false);

            }

        }
    } else { SYS.nouid() }    
}

function cart() {
    headertitle.innerHTML = "Cart";
    if (uid) {
        let last = new Page("users/" + uid + "/cart", Product, [uid, (product) => { Routing.goto(Routing.pages.show, false, Routing.seturlparam({ "product": product.id })) }], Product.displaymode.referenced, 9, null, products)
        last.scrolldown(() => { noproduct.style.display = "none" }, () => { })
        products.onscroll = async (e) => {
            const max = (e.target.scrollHeight - e.target.getBoundingClientRect().height);
            if (e.target.scrollTop == max) {
                await last.scrolldown(() => { }, () => { }, false, true, false);
            }
            else if (e.target.scrollTop == 0) {

                await last.scrollup(() => { e.target.scrollTo(0, 50) }, () => { }, true, false, false);

            }

        }
    } else { SYS.nouid() }    
}