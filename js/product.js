import { getDatabase, ref,get, update, remove, increment } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getallurl } from "./storageconfig.js";
const db = getDatabase();
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { Ntheme } from "./mode.js";

export default class Product{
    #data = {}
    #uid = null;
    #event = null;
    static rate = [5,4,3,2,1]
    static displaymode = {
        normal: (product) => {
            if (product.#data.stock < 1) { return this.displaymode.inactive(product)}
            const newproduct = document.createElement("div");
            const productimg = document.createElement("img");
            const rate = document.createElement("div");
            const lovecart = document.createElement("section");
            const love = document.createElement("div");
            const cart = document.createElement("div");
            const nameprice = document.createElement("section");
            const name = document.createElement("div");
            const price = document.createElement("div");
            newproduct.classList.add("newproduct");
            rate.classList.add("rate");
            lovecart.classList.add("lovecart");

            love.classList.add("love");
            cart.classList.add("cart");
            if (product.#uid) {
                get(ref(db, "users/" + product.#uid + "/love/" + product.#data.id))
                    .then((snapshot) => {
                        //$toggle(add or remove)
                        if (snapshot.exists()) {
                            love.classList.add("loved");
                        } else {
                            love.classList.remove("loved");
                        }
                    })
            
                get(ref(db, "users/" + product.#uid + "/cart/" + product.#data.id))
                    .then((snapshot) => {
                        //$toggle(add or remove)
                        if (snapshot.exists()) {
                            cart.classList.add("carted");
                        } else {
                            cart.classList.remove("carted");
                        }
                    })
            }

            nameprice.classList.add("nameprice");
            name.classList.add("name");
            price.classList.add("price");
            getallurl("/productsphoto/"+product.#data.id,(urls) => { productimg.src=urls[0]})
            productimg.setAttribute("width", "100%");
            newproduct.appendChild(productimg);

            rate.innerHTML = parseFloat(this.#ratecalculator(product.#data["sum-rate"],product.#data["n-rate"]));
            newproduct.appendChild(rate);
            lovecart.appendChild(love);
            love.innerHTML = "&#xf004;";
            love.addEventListener("click", (e) => {
                e.stopPropagation();
                if (product.#uid) {
                    love.classList.toggle("loved");
                    product.togglelove();
                } else { this.nouid()}
            })
            lovecart.appendChild(cart);
            cart.innerHTML = "&#xf217;";
            cart.addEventListener("click", (e) => {
                e.stopPropagation();
                if(product.#uid){ 
                    cart.classList.toggle("carted");
                    product.togglecart();
                } else { this.nouid() }
            })
            newproduct.appendChild(lovecart);
            nameprice.appendChild(name);
            name.innerHTML = product.#data["name"];
            nameprice.appendChild(price);
            price.innerHTML = product.#data["price"] + "$";
            newproduct.appendChild(nameprice);
            newproduct.addEventListener("click",product.#event.bind(null,product.#data))
            return newproduct;
        },
        search: (product) => {
            const listitem = document.createElement("button");
            const productimg = document.createElement("img");
            const itemdata = document.createElement("div");
            const name = document.createElement("span");
            const price = document.createElement("span");
            const pricevalue = document.createElement("span");
            const rate = document.createElement("span");

            getallurl("/productsphoto/" + product.#data.id, (urls) => { productimg.src = urls[0] })
            productimg.setAttribute("width", "70px");
            name.innerText = product.#data["name"];
            price.innerText = "price : ";
            pricevalue.innerText = product.#data["price"] + "$";
            rate.innerText = "rate : ";

            let ratevalue = this.#ratecalculator(product.#data["sum-rate"], product.#data["n-rate"]);
            for (var i = 0; i < ratevalue; i++) { 
              rate.innerHTML = rate.innerHTML +"&#xf005;";
            }
            (product.#data["sum-rate"] / product.#data["n-rate"])%1 == 0 || (rate.innerHTML +="&#xf5c0;");

            listitem.classList.add("dropdown-item");
            listitem.classList.add("searchdropdownitem");

            price.appendChild(pricevalue);
            itemdata.appendChild(name);
            itemdata.appendChild(price);
            itemdata.appendChild(rate);
            listitem.appendChild(productimg);
            listitem.appendChild(itemdata);
            listitem.addEventListener("click", product.#event.bind(null, product.#data))
            return listitem;
        },
        detiled: (product) => { 
            const productcontent = document.createElement("div");
            productcontent.classList.add("content", "row")
            productcontent.innerHTML = (`
                <div class="productphotos col-12 col-xl-5 d-flex justify-content-center align-items-center">
                    <div id="productphotos" class="swiper mySwiper">
                        <div class="swiper-wrapper">
                        
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                    </div>
                </div>
                <div class="productdata col-12 col-xl-7 position-relative">
                    <span id="proname" class="productname">${product.#data["name"]}</span>
                    <span class="productprice">Price : <span id="proprice" class="productpricevalue">${product.#data["price"]}</span>$</span>
                    <div class="ratelovecon">
                        <span id="prorate" class="productrate">&#xf005; x ${parseFloat(this.#ratecalculator(product.#data["sum-rate"], product.#data["n-rate"]))}</span>
                        <span id="prolove" class="productlove">&#xf004; x ${product.#data.loved}</span>
                    </div>
                    <span id="prodiscription" class="productdiscription">${product.#data["description"]}</span>
                    <div class="control">
                        <span class="productstock">Stock : <span id="prostock" class="productstockvalue">${product.#data["stock"]}</span></span>
                    </div>

                </div>

        `)
            const colors = document.createElement("div");
            colors.classList.add("color");
            for (const key in product.#data.color) {
                const color = document.createElement("div");
                color.style.backgroundColor = product.#data.color[key];
                colors.appendChild(color);
            }
            productcontent.children[1].children[4].appendChild(colors);

            const sizes = document.createElement("div");
            sizes.classList.add("size");
            sizes.innerText += "(EU) "
            for (const key in product.#data.size) {
                const size = document.createElement("div");
                size.innerText = " : " + product.#data.size[key];
                sizes.appendChild(size);
            }
            productcontent.children[1].children[4].appendChild(sizes);

            getallurl("/productsphoto/" + product.#data.id, (urls) => {
                productcontent.children[0].children[0].children[0].innerHTML = "";
                for (let inx = 0; inx < urls.length; inx++) {
                    const carouselitem = document.createElement("div");
                    carouselitem.classList.add("swiper-slide");
                    const carouselitemimg = document.createElement("img");
                    carouselitemimg.classList.add("d-block", "w-100");
                    carouselitemimg.src = urls[inx];
                    carouselitem.appendChild(carouselitemimg);
                    productcontent.children[0].children[0].children[0].appendChild(carouselitem);
                }
                new Swiper(".mySwiper", {
                    loop: true,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }
                });
            })
            
            const floatbtns = document.createElement("div");
            floatbtns.classList.add("sidebuttons");
            const mode = document.createElement("button");
            mode.classList.add("mode");
            mode.innerText = ""
            mode.addEventListener("click", () => {
                Ntheme.next();
            })
            floatbtns.appendChild(mode);
            const love = document.createElement("button");
            love.classList.add("love");
            get(ref(db, "users/" + product.#uid + "/love/" + product.#data.id))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        love.classList.add("loved");
                    } else {
                        love.classList.remove("loved");
                    }
                })
            love.innerText = ""
            love.addEventListener("click", () => {
                if (product.#uid) {
                    love.classList.toggle("loved");
                    product.togglelove();
                } else { this.nouid() }
            })
            floatbtns.appendChild(love);
            if (product.#data.stock >= 1) {
                const cart = document.createElement("button");
                cart.classList.add("cart");
                get(ref(db, "users/" + product.#uid + "/cart/" + product.#data.id))
                    .then((snapshot) => {
                        //$toggle(add or remove)
                        if (snapshot.exists()) {
                            cart.classList.add("carted");
                        } else {
                            cart.classList.remove("carted");
                        }
                    })
                cart.innerText = ""
                cart.addEventListener("click", () => {
                    if (product.#uid) {
                        cart.classList.toggle("carted");
                        product.togglecart();
                    } else { this.nouid() }
                })
                floatbtns.appendChild(cart);
            }

            const rate = document.createElement("button");

            const removerate = (e) => { 
                if (product.#uid) {
                    e.stopPropagation(); 
                    product.togglerate(false); rated = false; rate.blur();
                } else { this.nouid() }
            }
            const makerate = (rateval, e) => { 
                if (product.#uid) {
                    e.stopPropagation();  
                    product.togglerate(rateval); rated = true; rate.blur();
                } else { this.nouid() }
            }
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement("span");
                star.innerText = "";
                star.classList.add("rate");
                rate.appendChild(star);
                if (i > 1) {
                    star.addEventListener("click", makerate.bind(null, Product.rate[i - 1]));
                    star.style.display = "none"
                };
            }
            
            let rated = false;
            if (product.#uid) {
                get(ref(db, "rate/" + product.#data.id + "/" + product.#uid))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            rate.children[0].classList.add("rated");
                            rated = true;
                        } else {
                            rate.children[0].classList.remove("rated");
                            rated = false;
                        }
                    })
            }
            const delrate = document.createElement("span");
            delrate.classList.add("delrate");
            delrate.innerHTML = "&#xf12d;";
            delrate.addEventListener("click", removerate)
            rate.appendChild(delrate);
            delrate.style.display = "none" 

            const firststarevent = makerate.bind(null, 5);
            rate.addEventListener("click", () => {
                rate.classList.add("openrate");
                delrate.style.display = "inline";
                rate.children[0].addEventListener("click", firststarevent);
                for (let i = 1; i <= 4; i++) {
                    rate.children[i].style.display = "inline";

                }
                rate.children[0].classList.remove("rated");

            })
            rate.addEventListener("blur", () => {
                rate.classList.remove("openrate");
                delrate.style.display = "none";
                rate.children[0].removeEventListener("click", firststarevent);
                for (let i = 1; i <= 4; i++) {
                    rate.children[i].style.display = "none";
                }

                if (rated) {
                    rate.children[0].classList.add("rated");
                } else {
                    rate.children[0].classList.remove("rated");
                }
            })

            floatbtns.appendChild(rate);

            const comment = document.createElement("button");
            comment.innerText = ""
            comment.setAttribute("data-bs-target","#screenslider")
            comment.setAttribute("data-bs-slide","next")
            floatbtns.appendChild(comment);
            productcontent.children[1].appendChild(floatbtns)
            return productcontent;
        },
        inactive: (product) => { 
            const inactiveproduct = document.createElement("div");
            const productimg = document.createElement("img");
            const rate = document.createElement("div");
            const lovecart = document.createElement("section");

            const nameprice = document.createElement("section");
            const name = document.createElement("div");
            const price = document.createElement("div");
            inactiveproduct.classList.add("newproduct");
            inactiveproduct.classList.add("inactive");

            nameprice.classList.add("nameprice");
            name.classList.add("name");
            price.classList.add("price");
            getallurl("/productsphoto/" + product.#data.id, (urls) => { productimg.src = urls[0] })
            productimg.setAttribute("width", "100%");
            inactiveproduct.appendChild(productimg);

            inactiveproduct.appendChild(rate);

            inactiveproduct.appendChild(lovecart);
            nameprice.appendChild(name);
            name.innerHTML = product.#data["name"];
            nameprice.appendChild(price);
            price.innerHTML = product.#data["price"] + "$";
            inactiveproduct.appendChild(nameprice);
           
            return inactiveproduct
        },
        referenced: async(product) => {

            let x = await get(ref(db, "Products/" + product.#data.id))

            if (x.exists()) {
              
                product.#data = { ...product.#data, ...x.val() };
                   
                  
                    return this.displaymode.normal(product);
                } else { 
                   
                    remove(ref(db, "users/" + product.#uid + "/love/" + product.#data.id))
                    return this.displaymode.notfound(product);
                }
            
        },
        notfound: (product) => { 
            const inactiveproduct = document.createElement("div");
            const productimg = document.createElement("img");
            const nameprice = document.createElement("section");
            const name = document.createElement("div");
            const price = document.createElement("div");
            inactiveproduct.classList.add("newproduct");
            inactiveproduct.classList.add("inactive");
            nameprice.classList.add("nameprice");
            name.classList.add("name");
            price.classList.add("price");

            productimg.setAttribute("width", "100%");
            inactiveproduct.appendChild(productimg);
            nameprice.appendChild(name);
            name.innerHTML = "Not Found"
            nameprice.appendChild(price);
            price.innerHTML = "!";
            inactiveproduct.appendChild(nameprice);

            return inactiveproduct
        }
    }

    constructor(data={},uid=null,click=null){
        this.#data = data
        this.#uid = uid
        this.#event=click
    }

    togglelove(){
       
        get(ref(db, "love/" + this.#data.id + "/" + this.#uid))
            .then((snapshot) => {
           
                if (snapshot.exists()) {
                    remove(ref(db, "love/" + this.#data.id + "/" + this.#uid))
                    remove(ref(db, "users/" + this.#uid + "/love/" + this.#data.id))
                    update(ref(db, "Products/" + this.#data.id + ""), {loved:increment(-1)})
                } else { 
                    let rbody = {}

                    rbody[this.#uid] = true
                    update(ref(db, "love/" + this.#data.id), rbody)

                    rbody = {}

                    rbody[this.#data.id] = true
                    update(ref(db, "users/" + this.#uid + "/love"), rbody)
            
                    update(ref(db, "Products/" + this.#data.id + ""), { loved: increment(+1) })
                }

        }).catch((error) => { });
    }
    togglecart(){

        get(ref(db, "users/" + this.#uid + "/cart/" + this.#data.id))
            .then((snapshot) => {
               
                if (snapshot.exists()) {
                  
                    remove(ref(db, "users/" + this.#uid + "/cart/" + this.#data.id))
                } else {
                    let rbody = {}
                    rbody[this.#data.id] = true
                    update(ref(db, "users/" + this.#uid + "/cart"), rbody)
                }

            }).catch((error) => {  });
    }
    togglerate(rate){
       
        get(ref(db, "rate/" + this.#data.id + "/" + this.#uid))
            .then((snapshot) => {
                
                if (snapshot.exists()==true && rate == false) {
                        remove(ref(db, "rate/" + this.#data.id + "/" + this.#uid))
                        update(ref(db, "Products/" + this.#data.id + ""), { "n-rate": increment(-1) })
                        update(ref(db, "Products/" + this.#data.id + ""), { "sum-rate": increment(-snapshot.val()) })
                    } else if(( snapshot.exists()==true && rate)){ 
                        let rbody = {}
                        rbody[this.#uid] = rate
                        update(ref(db, "rate/" + this.#data.id), rbody)
                        update(ref(db, "Products/" + this.#data.id + ""), { "sum-rate": increment(-snapshot.val()) })
                        update(ref(db, "Products/" + this.#data.id + ""), { "sum-rate": increment(+rate) })
                        
                    } else if((snapshot.exists()==false && rate )){ 
                        let rbody = {}
                        rbody[this.#uid] = rate
                        update(ref(db, "rate/" + this.#data.id), rbody)
                        update(ref(db, "Products/" + this.#data.id + ""), { "n-rate": increment(+1) })
                        update(ref(db, "Products/" + this.#data.id + ""), { "sum-rate": increment(+rate) })
                    }

            }).catch((error) => {  });
    }
    create(displaymode) {
        return displaymode(this)
    }

    static #ratecalculator = (sum = 0, num = 0) => { 
        sum = parseFloat(sum);
        num = parseFloat(num);
        if (isNaN(sum) || isNaN(num) || sum<=0 || num<=0) { 
            return 0;
        } else {
            const rate = (sum / num).toFixed(1);

            switch (isFinite(rate)) {
                case true:
                    return rate;
                    break;
                    case false:
                    return 0;
                    break;
            }
        }
    }

    static destroy(pageitem={}) {
        pageitem.target.remove();
        pageitem.obj = null;
    }
    static nouid = () => { }
    
}

