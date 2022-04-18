// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCtSsAIy3AFecDUcyvX7l6gbp-FKhQgeQs",
    authDomain: "freebridge.firebaseapp.com",
    projectId: "freebridge",
    storageBucket: "freebridge.appspot.com",
    messagingSenderId: "856419566005",
    appId: "1:856419566005:web:64f1efe8de70461f9119fc",
    measurementId: "G-CZJFR4Q370"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);  
