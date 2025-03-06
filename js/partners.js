import { getallurl } from "./storageconfig.js";


export default class Partners {

    #data = {}
    #event = null;
    static displaymode = {
        normal: (partner) => {
            
            const boxicon = document.createElement("img");
            boxicon.style.width = "100%"; 
            getallurl("/partners/"+partner.#data.id, (urls) => {
                boxicon.src = urls[0];
            })

            const box = document.createElement("div");
            box.classList.add("d-flex", "justify-content-center", "align-items-center");
            box.appendChild(boxicon);

            
            return box;
        }
    }

    constructor(data = {}, click = null) {
        this.#data = { ...data };
        this.#event = click;
    }

   
    create(displaymode) {
        return displaymode(this)
    } 

    static destroy(pageitem = {}) {
        pageitem.target.remove();
        pageitem.obj = null;
    }

}