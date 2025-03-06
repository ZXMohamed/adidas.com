import Chat from "./chat.js";
import Routing from "./routing.js";

const floatpage = document?.getElementById('floatpage');
const loved = document?.getElementById('loved');
const cart = document?.getElementById('cart');
const chatfloat = document?.getElementById('chatfloat');
const chat = document?.getElementById('chat');
const filtermenuchat = document?.getElementById("filtermenuchat");
const closefloatpagebtn = document?.getElementById("closefloatpagebtn");
const closechatpagebtn = document?.getElementById("closechatpagebtn");

loved?.addEventListener('click', openfloatpage.bind(null, "wish_list"));
cart?.addEventListener('click', openfloatpage.bind(null, "cart"));
closefloatpagebtn?.addEventListener('click', closefloatpage);

let opened = false;

function openfloatpage(mode, e) { 
    e.stopPropagation();
    if (opened==false) {
        const frame = document.createElement('iframe');
        frame.src = Routing.pages.wishlist + Routing.seturlparam({"function": mode});
        frame.scrolling = 'no';
        frame.frameBorder = '0';
        floatpage.appendChild(frame);
        floatpage.style.display = 'block';
        
        opened = true;
    
    } 

}
function closefloatpage(e) { 
    e.stopPropagation();
    if (opened == true) {

        floatpage.children[1].remove();
        floatpage.style.display = 'none';
        opened = false;
    }
}

chat?.addEventListener('click', openchat);
filtermenuchat?.addEventListener('click', openchat);
closechatpagebtn?.addEventListener('click', closechatpage);

let chatopened = false;


function openchat(e) {
    e.stopPropagation();
    if (chatopened == false) {
        const frame = document.createElement('iframe');
        frame.src = Routing.pages.chat;
        frame.scrolling = 'no';
        frame.frameBorder = '0';
        chatfloat.appendChild(frame);
        chatfloat.style.display = 'block';

        chatopened = true;
        Chat.chatuiopen = true;

    } else {

        chatfloat.children[1].remove();
        chatfloat.style.display = 'none';
        chatopened = false;
        Chat.chatuiopen = false;

    }

}
function closechatpage(e) {
    e.stopPropagation();
    if (chatopened == true) {

        chatfloat.children[1].remove();
        chatfloat.style.display = 'none';
        chatopened = false;
        Chat.chatuiopen = false;
    }
}