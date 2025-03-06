import { app } from "./serverconfig.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import Routing from "./routing.js";
const auth = getAuth();


export const getuser = function (callback) {

    onAuthStateChanged(auth, (user) => {
        if (user) {

            if (!user.emailVerified && location.pathname != '/web/signup.html') {
                Routing.goto(Routing.pages.manageaccount+Routing.seturlparam({"function":"verify_email"}), true);
            } else {
                callback(user.uid);
            }

        } else {
            callback(null);
        }
    });
}