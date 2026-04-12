// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlsCNKe8hHeIjj95BvoSdjaV4ycQSlVME",
    authDomain: "pawpal-3806b.firebaseapp.com",
    projectId: "pawpal-3806b",
    storageBucket: "pawpal-3806b.firebasestorage.app",
    messagingSenderId: "663450986587",
    appId: "1:663450986587:web:64159338848e5f0d32777e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };