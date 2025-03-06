export default class Routing{
    static pages={
        main: "/index.html",
        store: "/web/product.html",
        show: "/web/showproduct.html",
        signup: "/web/signup.html",
        manageaccount: "/web/verifyemail.html",
        wishlist: "/web/wishlist.html",
        chat: "/web/chat.html"
    }

    static geturlparam = function () {
        let urlparam = location.search.replace("?","").trim();
        let paramarr = urlparam.split("&");
        let output = {};
        for (const param of paramarr) {
            let key_val = param.split("=");
            output[key_val[0]]=key_val[1]
        }
        return output;
    }

    static seturlparam = function (params) {
        if(typeof(params) === 'object'){
            let output = "?";
            for (const key in params) {
                output+=key+"="+params[key]+"&"
            }
            return output;
        }
        
    }

    static goto = function (page,replace=false,params="") {
        replace ?
            window.top.location.replace(page+params) :
            window.top.location.assign(page+params)  ;
    }
 
}