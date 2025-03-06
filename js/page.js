import { app } from "./serverconfig.js";
import { getDatabase, ref, get, query, startAt, startAfter, orderByKey, endAt, endBefore, limitToLast, limitToFirst } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const db = getDatabase();

export default class Page{
    _curruntpage={};
    _nav = {};
    items = [];
    static empty = { nav: 0, up: 1, down: 2, ignore: 3 }
    constructor(url="",item=null,itemarg=[],displaymode=null,count=0,searchquery=null,target=null){
        this._curruntpage.url = url;
        this._curruntpage.item = item;
        this._curruntpage.itemarg = itemarg;
        this._curruntpage.displaymode = displaymode;
        this._curruntpage.target = target;

        if (searchquery) {
            this._nav.query = query(ref(db, searchquery.path), ...searchquery.queryparams);
            this._curruntpage.outerquery = true;
        } else {
            this._curruntpage.outerquery = false;
            this._nav.count = count;

            this._nav.scrollcount = count;

            this._nav.pagesmoved = 0;
  
        }
        
    }
    async firstid() {

            const recentPostsRef = query(ref(db, this._curruntpage.url), orderByKey(), limitToFirst(1));
            const snapshot = await get(recentPostsRef)
            if (snapshot.exists()) {
                return Object.keys(snapshot.val())[0];
            }
      
        return null;
    }
    async lastid() {

            const recentPostsRef = query(ref(db, this._curruntpage.url), orderByKey(), limitToLast(1));
            const snapshot = await get(recentPostsRef)
            if (snapshot.exists()) {
                return Object.keys(snapshot.val())[0];
            }
     
        return null;
    }
    async next(targetfull = null, Rempty = null, ontop = false, arrange = true, scrolldown = false) {
        if (this._curruntpage.outerquery) {
            this.get(targetfull, Rempty, [ontop, arrange, scrolldown]);
        } else {
            if (!this._nav.lastid) {
                const lid = await this.lastid();
                this._nav.lastid = lid;
                this._nav.pos = this._nav.lastid;
                this._nav.nextpos = this._nav.lastid;
                this._nav.prevpos = this._nav.lastid;
            }
            if (this._nav.nextpos != this._nav.firstid) {
                this._nav.pos = this._nav.nextpos;
                this._nav.query = query(ref(db, this._curruntpage.url), orderByKey(), endAt(this._nav.pos.toString()), limitToLast(parseInt(this._nav.count)));
                this.get((val) => {
                    this._nav.prevpos = this._nav.pos;
                    this._nav.nextpos = this.items[this.items.length - 1].id;
                    this._nav.pagesmoved++;
                    targetfull()
                }, Rempty, [ontop, arrange, scrolldown]);
            }
            if (!this._nav.firstid) {
                const fid = await this.firstid();
                this._nav.firstid = fid;
            }
        }    
    }
    async prev(targetfull = null, Rempty = null, ontop = false, arrange = true, scrolldown = false) {
        if (this._curruntpage.outerquery) {
            //$call get
            this.get(targetfull, Rempty, [ontop, arrange, scrolldown]);
        } else {
            if (!this._nav.firstid) {
                const fid = await this.firstid();
                this._nav.firstid = fid;
            }
            if (this._nav.prevpos != this._nav.lastid) {
                this._nav.pos = this._nav.prevpos;
                this._nav.query = query(ref(db, this._curruntpage.url), orderByKey(), startAt(this._nav.pos.toString()), limitToFirst(parseInt(this._nav.count)));
                this.get((val) => {
                    this._nav.nextpos = this._nav.pos;
                    this._nav.prevpos = this.items[0].id;

                    this._nav.pagesmoved--;

                    targetfull()
                }, Rempty, [ontop, arrange, scrolldown]);
            }
            if (!this._nav.lastid) {
                const lid = await this.lastid();
                this._nav.lastid = lid;
                this._nav.pos = this._nav.lastid;
                this._nav.nextpos = this._nav.lastid;
                this._nav.prevpos = this._nav.lastid;
            }
        }
    }
    async scrolldown(targetfull = null, Rempty = null, ontop = false, arrange = true, scrolldown = false) { 
        let end = (pos) => endBefore(pos);
        let empty = Page.empty.down;
        if (ontop && arrange) {
            empty = Page.empty.up;
        } else if(!ontop && arrange) { 
            empty = Page.empty.down;
        }

        if (this._curruntpage.outerquery) {
            //$call get
            this.get(targetfull, Rempty, [ontop, arrange, scrolldown]);
        } else {
            if (!this._nav.lastid) {
                const lid = await this.lastid();
                this._nav.lastid = lid;
                this._nav.pos = this._nav.lastid;
                this._nav.nextpos = this._nav.lastid;
                this._nav.prevpos = this._nav.lastid;
                //*load just first
                end = (pos) => endAt(pos);
                empty = Page.empty.ignore;
            }
            if (this._nav.nextpos != this._nav.firstid) {
                this._nav.pos = this._nav.nextpos;
                this._nav.query = query(ref(db, this._curruntpage.url), orderByKey(), end(this._nav.pos.toString()), limitToLast(parseInt(this._nav.scrollcount)));
                this.get((val) => {
                    if (!ontop && arrange) {
                        this._nav.prevpos = this.items[0].id
                        this._nav.nextpos = this.items[this.items.length - 1].id;
                        this._nav.pagesmoved++;
                    } else if (ontop && arrange) {
                        this._nav.prevpos = this.items[this.items.length - 1].id;
                        this._nav.nextpos = this.items[0].id
                        this._nav.pagesmoved++;
                    }

                    targetfull()
                }, Rempty, [ontop, arrange, scrolldown],empty);
            }
            if (!this._nav.firstid) {
                const fid = await this.firstid();
                this._nav.firstid = fid;
            }
            this._nav.scrollcount = 2;
        }    
    }
    async scrollup(targetfull = null, Rempty = null, ontop = true, arrange = false, scrolldown = false) { 
        let empty = Page.empty.up;
        if (ontop && !arrange) { 
            empty = Page.empty.up;
        } else if(!ontop && !arrange) {
            empty = Page.empty.down;
        }
        if (this._curruntpage.outerquery) {
            //$call get
            this.get(targetfull, Rempty, [ontop, arrange, scrolldown]);
        } else {
            if (!this._nav.firstid) {
                const fid = await this.firstid();
                this._nav.firstid = fid;
            }
            if (this._nav.prevpos != this._nav.lastid) {
                this._nav.pos = this._nav.prevpos;
                this._nav.query = query(ref(db, this._curruntpage.url), orderByKey(), startAfter(this._nav.pos.toString()), limitToFirst(parseInt(this._nav.scrollcount)));
                this.get((val) => {
                    if (ontop && !arrange) {
                        this._nav.nextpos = this.items[this.items.length - 1].id
                        this._nav.prevpos = this.items[0].id
                        this._nav.pagesmoved--;
                    } else if (!ontop && !arrange) {
                        this._nav.nextpos = this.items[0].id
                        this._nav.prevpos = this.items[this.items.length - 1].id
                        this._nav.pagesmoved--;
                    }
                    
                    targetfull()
                }, Rempty, [ontop, arrange, scrolldown], empty);
            }
            if (!this._nav.lastid) {
                const lid = await this.lastid();
                this._nav.lastid = lid;
                this._nav.pos = this._nav.lastid;
                this._nav.nextpos = this._nav.lastid;
                this._nav.prevpos = this._nav.lastid;
            }
            //*load countiniuas
            this._nav.scrollcount = 2;
        }
    }
    async get(targetfull = null, Rempty = null, injectoptions = [], empty = Page.empty.nav, reinject = false) {
        if (!reinject) {
            this._curruntpage.snapshot = await get(this._nav.query);
            if (this._curruntpage.snapshot.exists()) {
                switch (empty) {
                    case Page.empty.nav:
                       
                        for (let item of this.items) {
                            this._curruntpage.item.destroy(item);
                        }
                        this.items = [];
                        break;
                    case Page.empty.up:
                        try {
                            for (let i = 0; i < this._nav.scrollcount;i++) { 
                                this._curruntpage.item.destroy(this.items[this.items.length-1]);
                                this.items.pop();
                            }
                        } catch (ex) { }
                        break;
                }
                await this._inject(this._curruntpage.snapshot, ...injectoptions);
                switch (empty) {
                    case Page.empty.down:
                        try {
                            for (let i = 0; i < this._nav.scrollcount; i++) {
                                this._curruntpage.item.destroy(this.items[0]);
                                this.items.shift();
                            }
                            
                        } catch (ex) { }
                        break;
                }
                targetfull(this._curruntpage.snapshot.val());
            } else {
                Rempty();
            }
        } else { 
            if (this._curruntpage.snapshot) {
                for (let item of this.items) {
                    this._curruntpage.item.destroy(item);
                }
                this.items = [];

                await this._inject(this._curruntpage.snapshot, ...injectoptions);
                targetfull(this._curruntpage.snapshot.val());
            }
        }
    }
    async _inject(snapshot, ontop = false, arrange = true, scrolldown = false, indexed = true) {

        const setitem = async (i) => {
            let item = new this._curruntpage.item({ id: i, ...snapshot.val()[i], path: snapshot.ref.toString().split(".app/")[1] + "/" + i }, ...this._curruntpage.itemarg, this)
            let node = await item.create(this._curruntpage.displaymode);
            if (!node.then) {
                if (!ontop) {
                    this._curruntpage.target.appendChild(node);
                    indexed?this.items.push( {id:i, obj: item, target: node }):false;
                } else {
                    this._curruntpage.target.insertBefore(node, this._curruntpage.target.children[0]);
                    indexed?this.items.unshift ( { id: i, obj: item, target: node }):false;
                }
            } else {
                node.then((node) => {
                    if (!ontop) {
                        this._curruntpage.target.appendChild(node)
                        indexed?this.items.push ( { id: i, obj: item, target: node }):false;
                    } else {
                        this._curruntpage.target.insertBefore(node, this._curruntpage.target.children[0]);
                        indexed?this.items.unshift ( { id: i, obj: item, target: node }):false;
                    }
                });
            }
        }

        if (snapshot) { 
            if (arrange) {
                const data = Object.keys(snapshot.val())
                let inx = data.length - 1;
                for (inx; inx >= 0; inx--) {
                    await setitem(data[inx]);
                }
            } else {
                const data = snapshot.val()
                for (var inx in data) {
                    await setitem(inx);
                }
                scrolldown&&this._curruntpage.target.scrollTo(0, this._curruntpage.target.scrollHeight - this._curruntpage.target.getBoundingClientRect().height)
            }
        }


    }
    async outerinject(snapshot, ontop = false, arrange = false, scrolldown = true, indexed = true) {

        if (this._nav.pagesmoved <= 1) {
            await this._inject(snapshot, ontop,arrange,scrolldown,indexed);
            scrolldown && this._curruntpage.target.scrollTo(0, this._curruntpage.target.scrollHeight - this._curruntpage.target.getBoundingClientRect().height)
        }

        const lid = await this.lastid();
        this._nav.lastid = lid;
        this._nav.prevpos = this._nav.lastid;
      
            
    }
    async outerinjectitem(id, obj, node, ontop = false, scrolldown = false, indexed = true) {

        if (this._nav.pagesmoved <= 1) {
            if (!node.then) {
                if (!ontop) {
                    this._curruntpage.target.appendChild(node);
                    indexed?this.items.push({ id: id, obj: obj, target: node }):false;
                } else {
                    this._curruntpage.target.insertBefore(node, this._curruntpage.target.children[0]);
                    indexed ? this.items.unshift({ id: id, obj: obj, target: node }) : false;
                }
            } else {
                node.then((node) => {
                    if (!ontop) {
                        this._curruntpage.target.appendChild(node)
                        indexed?this.items.push({ id: id, obj: obj, target: node }):false;
                    } else {
                        this._curruntpage.target.insertBefore(node, this._curruntpage.target.children[0]);
                        indexed?this.items.unshift({ id: id, obj: obj, target: node }):false;
                    }
                });
            }
            scrolldown && this._curruntpage.target.scrollTo(0,this._curruntpage.target.getBoundingClientRect().height)
        }
 
        const lid = await this.lastid();
        this._nav.lastid = lid;
      
    }
    reset() { 

        for (let item of this.items) {
            this._curruntpage.item.destroy(item);
        }
        this._nav.scrollcount = this._nav.count;
        this._nav.firstid = undefined;
        this._nav.lastid = undefined;
        this._nav.pos = this._nav.lastid;
        this._nav.nextpos = this._nav.lastid;
        this._nav.prevpos = this._nav.lastid;
        this._curruntpage.snapshot = {}
        this._nav.pagesmoved = 0;
        this.items = [];

    }
    empty() { 
        for (let item of this.items) {
            this._curruntpage.item.destroy(item);
        }
        this.items = [];
    }
    async remove(id) { 

        let item = {};
        this.items = this.items.filter((val) => {
            if (val.id == id) {
                item = val;
                return false;
            }
            return true;
        });

        this._curruntpage.item.destroy(item);
    }
    static nouid = () => { }
    
}