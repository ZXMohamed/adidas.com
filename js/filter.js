import Page from "./page.js";
export default class Filter extends Page {

    filters = {
        price: {
            key: "price",
            range:{
                from: "0",
                to: "0"
            }
        },
        size: {
            key: "size",
            value: "0",
            getselected: function (datasize) {
                for (const size of datasize) {
                    if (this.value == size) { return true; }
                }
                return false;
            }
        },
        color: {
            key: "color",
            value: [],
            getselected: function (datacolors) {
                
                for (const color of datacolors) {
                    if (this.value.includes(color)) {
                        return true;
                    }
                }
                return false;
            }
        }, 
        category: {
            men: {
                key: "men",
                value: true
            },
            women: {
                key: "women",
                value: true
            },
            getselected: function (datacategory) { 
                if (this.men.value == true && this.women.value == true) {
                    return true;
                } else if (this.men.value == true && datacategory == "men") {
                    return true;

                } else if (this.women.value == true && datacategory == "women") {
                    return true;
                } else {
                    return false
                }
            }
        }
    }
    constructor(url = "", item = null, itemarg = [], displaymode = null, count = 0, searchquery = null, target = null) {
        super(...arguments);
    }
    #apply=(data = {})=> {
        
        if (this.filters.category.getselected(data["category"]) &&
            data["price"] >= parseFloat(this.filters.price.range.from) &&
            data["price"] <= parseFloat(this.filters.price.range.to) &&
            this.filters.size.getselected(data["size"]) &&
            this.filters.color.getselected(data["color"])) {
            return true;
        } else { 
            return false;
        }
       
    }

    _inject = (snapshot, ontop = false, arrange = true, scrolldown = false) => {

        const setitem = (i) => {
            let item = new this._curruntpage.item({ id: i, ...snapshot.val()[i], path: snapshot.ref.toString().split(".app/")[1] + "/" + i }, ...this._curruntpage.itemarg,this)
            let node = null;
            if (this.#apply(snapshot.val()[i])) {
                
                node = item.create(this._curruntpage.displaymode);
            } else { 
                
                node = item.create(this._curruntpage.item.displaymode.inactive);
            }

            if (!node.then) {
                if (!ontop) {
                    this._curruntpage.target.appendChild(node);
                    this.items.push({ id: i, obj: item, target: node });
                } else {
                    this._curruntpage.target.insertBefore(node, this._curruntpage.target.children[0]);
                    this.items.unshift({ id: i, obj: item, target: node });
                }
            } else {
                node.then((node) => {
                    if (!ontop) {
                        this._curruntpage.target.appendChild(node)
                        this.items.push({ id: i, obj: item, target: node });
                    } else {
                        this._curruntpage.target.insertBefore(node, this._curruntpage.target.children[0]);
                        this.items.unshift({ id: i, obj: item, target: node });
                    }
                });
            }
        }
        if (snapshot) {
            if (arrange) {
                const data = Object.keys(snapshot.val())
                let inx = data.length - 1;
                for (inx; inx >= 0; inx--) {
    
                    setitem(data[inx]);
                }
            } else {
                const data = snapshot.val()
                for (var inx in data) {
  
                    setitem(inx);
                }
                scrolldown && this._curruntpage.target.scrollTo(0, this._curruntpage.target.scrollHeight - this._curruntpage.target.getBoundingClientRect().height)
            }
        }
    }

}