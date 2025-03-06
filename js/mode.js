import Cookies from "/js/cookies.js";

const mode = document?.getElementById('mode');
var themes = { dark: setdarktheme, light: setlighttheme, default: setdefaulttheme };
export const Ntheme = nexttheme();
mode?.addEventListener("click", () => { 
    Ntheme.next()
});
var inx = -1;
function* nexttheme() { 
    while (true) { 
        if (inx == Object.values(themes).length-1) { 
            inx = -1;
        }
        inx++;
        yield Object.values(themes)[inx]();
    }
}


var root = document.querySelector(':root');

export var selectedmode = "default"; 


function setdefaulttheme() {
    selectedmode = "default";
    Cookies.setcookies({ theme: { value: "default" ,expires:"Thu, 18 Dec 2030 12:00:00 UTC"} })
    root.style.setProperty('--dark','#222a35');
    root.style.setProperty('--opacitydark','#222a358f');
    root.style.setProperty('--opacitydark2','#222a35e1');
    root.style.setProperty('--mid','#333f50');
    root.style.setProperty('--light','#8497B0');
    root.style.setProperty('--midlight','#44546A');
    root.style.setProperty('--secbg',' #ffffff');
    root.style.setProperty('--buttonbg',' #ffffff');
    root.style.setProperty('--secbgmid',' #f2f2f2');
    root.style.setProperty('--opacitysecbgmid',' #f2f2f262');
    root.style.setProperty('--title',' white');
    root.style.setProperty('--navlink',' white');
    root.style.setProperty('--placeholder',' #333f50');
    root.style.setProperty('--searchitemtitle','#6d7785');
    root.style.setProperty('--searchitemprice',' #a6a6a6');
    root.style.setProperty('--searchitemrate','#8497b0');
    root.style.setProperty('--searchitemhover','#6d7785');
    root.style.setProperty('--close',' red');
    root.style.setProperty('--love',' red');
    root.style.setProperty('--rate',' #eeb500');
    root.style.setProperty('--price',' #eeb500');
    root.style.setProperty('--buttonhover','#8497b0');
    root.style.setProperty('--splitborder','#404040');
    root.style.setProperty('--scrollbar',' rgba(192, 192, 192, 0.527)');
    root.style.setProperty('--scrollbardark',' rgba(192, 192, 192, 0)');

    root.style.setProperty('--msgdate','#8497B0');
    root.style.setProperty('--msgdatebg',' #f9f9f9');
    root.style.setProperty('--sendermsgbg','#8497B0');
    root.style.setProperty('--contactrmsgbg','#222a35');
    root.style.setProperty('--chatmsgcolor',' #ffffff');
    root.style.setProperty('--chatcolor',' #000000');

    root.style.setProperty('--commentreplaybg','#44546a36');

    root.style.setProperty('--formsmallbtn','#8497B0');

    root.style.setProperty('--welcometext', '#002060');
    
    root.style.setProperty('--menucolor', '#000000');

    root.style.setProperty('--productbox', '#ffffff');

    root.style.setProperty('--signupgradient','linear-gradient(114deg,#2c364571 0% 7%,#333e4f 25%,#333e4f 37%,#2f3e53ab 95% 100%)');
    root.style.setProperty('--showproductgradient','linear-gradient(43.5deg,#2c364500 0% 7%,#333e4f21 25%,#232b3627 25% 28%,#333e4f77 37%,var(--dark) 37.1%,#27303d8f 51%,#2f3e5367 95% 100%)');
}

function setlighttheme() {
    selectedmode = "light";
    Cookies.setcookies({ theme: { value: "light" ,expires:"Thu, 18 Dec 2030 12:00:00 UTC"} })
    root.style.setProperty('--dark','#dddddd');
    root.style.setProperty('--opacitydark','#222a358f');
    root.style.setProperty('--opacitydark2','#ffffffaa');
    root.style.setProperty('--mid','#f1f1f1');
    root.style.setProperty('--light','#eaeaea');
    root.style.setProperty('--midlight','#b1b1b1');
    root.style.setProperty('--secbg',' #ffffff');
    root.style.setProperty('--buttonbg',' #ffffff');
    root.style.setProperty('--secbgmid',' #f2f2f2');
    root.style.setProperty('--opacitysecbgmid',' #f2f2f262');
    root.style.setProperty('--title','#404040');
    root.style.setProperty('--navlink','#404040');
    root.style.setProperty('--placeholder',' #404040');
    root.style.setProperty('--searchitemtitle','#6d7785');
    root.style.setProperty('--searchitemprice',' #a6a6a6');
    root.style.setProperty('--searchitemrate','#8497b0');
    root.style.setProperty('--searchitemhover','#6d7785');
    root.style.setProperty('--close',' red');
    root.style.setProperty('--love',' red');
    root.style.setProperty('--rate',' #eeb500');
    root.style.setProperty('--price',' #000000');
    root.style.setProperty('--buttonhover','#8497b0');
    root.style.setProperty('--splitborder','#404040');
    root.style.setProperty('--scrollbar',' rgba(192, 192, 192, 0.527)');
    root.style.setProperty('--scrollbardark',' rgba(192, 192, 192, 0)');

    root.style.setProperty('--msgdate','#8497B0');
    root.style.setProperty('--msgdatebg',' #f9f9f9');
    root.style.setProperty('--sendermsgbg','#8497B0');
    root.style.setProperty('--contactrmsgbg','#222a35');
    root.style.setProperty('--chatmsgcolor',' #ffffff');
    root.style.setProperty('--chatcolor',' #000000');

    root.style.setProperty('--commentreplaybg','#44546a36');

    root.style.setProperty('--formsmallbtn','#404040');

    root.style.setProperty('--welcometext', '#002060');
    
    root.style.setProperty('--menucolor', '#000000');
    
    root.style.setProperty('--productbox', '#404040');

    root.style.setProperty('--signupgradient','none');
    root.style.setProperty('--showproductgradient','none');
}

function setdarktheme() {
    selectedmode = "dark";
    Cookies.setcookies({ theme: { value: "dark" ,expires:"Thu, 18 Dec 2030 12:00:00 UTC"} })
    root.style.setProperty('--dark','#333f50');
    root.style.setProperty('--opacitydark','#222a358f');
    root.style.setProperty('--opacitydark2','#222a35e1');
    root.style.setProperty('--mid','#333f50');
    root.style.setProperty('--light','#8497B0');
    root.style.setProperty('--midlight','#44546A');
    root.style.setProperty('--secbg',' #222a35');
    root.style.setProperty('--buttonbg',' #ffffff');
    root.style.setProperty('--secbgmid',' #f2f2f2');
    root.style.setProperty('--opacitysecbgmid',' #f2f2f262');
    root.style.setProperty('--title',' white');
    root.style.setProperty('--navlink',' white');
    root.style.setProperty('--placeholder',' #333f50');
    root.style.setProperty('--searchitemtitle','#6d7785');
    root.style.setProperty('--searchitemprice',' #a6a6a6');
    root.style.setProperty('--searchitemrate','#8497b0');
    root.style.setProperty('--searchitemhover','#6d7785');
    root.style.setProperty('--close',' red');
    root.style.setProperty('--love',' red');
    root.style.setProperty('--rate',' #eeb500');
    root.style.setProperty('--price',' #eeb500');
    root.style.setProperty('--buttonhover','#8497b0');
    root.style.setProperty('--splitborder','#404040');
    root.style.setProperty('--scrollbar',' rgba(192, 192, 192, 0.527)');
    root.style.setProperty('--scrollbardark',' rgba(192, 192, 192, 0)');

    root.style.setProperty('--msgdate','#8497B0');
    root.style.setProperty('--msgdatebg','rgb(34, 40, 48)');
    root.style.setProperty('--sendermsgbg','#8497B0');
    root.style.setProperty('--contactrmsgbg','#333f50');
    root.style.setProperty('--chatmsgcolor',' #ffffff');
    root.style.setProperty('--chatcolor',' #ffffff');

    root.style.setProperty('--commentreplaybg','#44546a36');

    root.style.setProperty('--formsmallbtn','#8497B0');

    root.style.setProperty('--welcometext', '#ffffff');
    
    root.style.setProperty('--menucolor', '#ffffff');

    root.style.setProperty('--productbox', '#ffffff');

    root.style.setProperty('--signupgradient','none');
    root.style.setProperty('--showproductgradient',' linear-gradient(43.5deg,#2c364500 0% 7%,#333e4f21 25%,#232b3627 25% 28%,#333e4f77 37%,var(--dark) 37.1%,#27303d8f 51%,#2f3e5367 95% 100%)');
}


let lasttheme = Cookies.getcookies()[" theme"]
if (lasttheme) {
    themes[lasttheme]();
    inx = Object.keys(themes).indexOf(lasttheme);
} else { 
    setdefaulttheme()
}