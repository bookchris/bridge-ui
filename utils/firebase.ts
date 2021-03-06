import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtSsAIy3AFecDUcyvX7l6gbp-FKhQgeQs",
  authDomain: "freebridge.firebaseapp.com",
  projectId: "freebridge",
  storageBucket: "freebridge.appspot.com",
  messagingSenderId: "856419566005",
  appId: "1:856419566005:web:64f1efe8de70461f9119fc",
  measurementId: "G-CZJFR4Q370",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
