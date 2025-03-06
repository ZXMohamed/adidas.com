export default class Cookies {

    static getcookies = function () {
        let output = {};
        let cookiesarr = window.document.cookie.split(";");
        for (const cooky of cookiesarr) {
            let key_val = cooky.split("=");
            output[key_val[0]] = key_val[1]
        }
        return output;
    }

    static setcookies = function (params) {
        if (typeof (params) === 'object') {
            
            for (const key in params) {
                window.document.cookie = key + "=" + params[key].value + "; expires = " + params[key].expires + "; path=/"
            }
            return true;
        }

    }

    static setsession = function (params) {
        if (typeof (params) === 'object') {

            for (const key in params) {
                window.document.cookie = key + "=" + params[key] + "; path=/"
            }
            return true;
        }

    }


}