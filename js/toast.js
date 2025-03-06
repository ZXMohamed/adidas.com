export default class Toast { 

    constructor() {
        throw "can't make constructor for abstract class";
    }

    static add(title = "ALERT !", time = "&#xf017;", icon ="&#xf0e0;",msg="",node=null,duration=5000,event=null,target) { 
        let toastid = "toast"+Math.random().toString().split(".")[1];

        const toastcon = document.createElement("div");
        toastcon.innerHTML += `
            <div id="${toastid}" class="toast hide" data-delay="${duration}" style="min-width:280px; font-family:symbols;">
                <div class="toast-header">
                    <span class="rounded me-2" style="font-family:symbols;">${icon}</span>
                    <strong class="me-auto">${title}</strong>
                    <small>${time}</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    <!--${node}-->
                    
                    ${msg}
                </div>
            </div>
            `
        if (node) { 
            toastcon.children[0].children[1].insertBefore(node, toastcon.children[0].children[1].children[0])
        }
        
        target.appendChild(toastcon);
        
        new bootstrap.Toast(document.getElementById(toastid)).show();
        
        event ? document.getElementById(toastid).children[1].addEventListener("click", event) : false
        
    }
}