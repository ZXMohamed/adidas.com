import "https://code.jquery.com/jquery-3.7.1.js";
import "https://code.jquery.com/ui/1.14.1/jquery-ui.js";
let $ = jQuery.noConflict();
let initmin = 0;
let initmax = 100;
export function initrange(idselector = "", from = 0, to = 100, onchange = null, onslide = null) {
    $("#" + idselector).slider({
        range: true,
        min: from,
        max: to,
        values: [from, to],
        change: onchange,
        slide: onslide
    });
    initmax = to;
    initmin = from;
}
export function resetrange(idselector = "") {
    $("#" + idselector).slider("values",0,initmin);
    $("#" + idselector).slider("values",1,initmax);
}
