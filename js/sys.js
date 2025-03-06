import Toast from "./toast.js";
import Cookies from "./cookies.js";
import Routing from "./routing.js";

Object.setontop = function (property = {}, obj = {}) {
    let temp = {}
    Object.assign(temp, property, obj);
    for (let c in temp) {
        if (Object.keys(property).includes(c)) {
            obj[c] = property[c];
            continue;
        }
        delete obj[c]
        obj[c] = temp[c]
    }
}

export default class SYS { 
    constructor() { 
        throw "can't make constructor for abstract class";
    }

    static datecalculate(millisecond) {
        const date = new Date(millisecond);
        return ((date.getHours() < 10 ?
            "0" + date.getHours() :
            date.getHours()) + ":" + (date.getMinutes() < 10 ?
                "0" + date.getMinutes() :
                date.getMinutes()) + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear())
    }

    static nouid = () => {
        Toast.add("account", undefined, "&#xf2bb;", "Please Login to your Account or Register a new Account", null, 10000, () => {
                Cookies.setsession({ "openloginform": "true" });
                Routing.goto(Routing.pages.main, false);
    },document.getElementById("alertpool"))}
    

}