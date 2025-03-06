
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYygJ3yS3uN1nSD5AsBPQP-bfLDQDX-iE",
    authDomain: "fireauth-d3aef.firebaseapp.com",
    databaseURL: "https://adidas-shop-95690-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fireauth-d3aef",
    storageBucket: "fireauth-d3aef.appspot.com",
    messagingSenderId: "392866553267",
    appId: "1:392866553267:web:5950e44a848db0ef377fc6"
};



const app = initializeApp(firebaseConfig, "storage");



import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

export const storage = getStorage(app);

export function getfileurl(path,callback) { 
    getDownloadURL(ref(storage, path))
    .then((url) => {

        callback(url)

    })
    .catch((error) => {console.log(error);

    });

}

export function getallurl(path, callback) {

    const listRef = ref(storage, path);


    listAll(listRef)
        .then((res) => {
            let urls=[]

            for (const item of res.items) {
                urls.push(getDownloadURL(item)); 
            }
            Promise.all(urls).then((urls) => { callback(urls)})

        }).catch((error) => {console.log(error);

        });
}
