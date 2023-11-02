import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrKmywBFKcK3Ebzu-wU6YhiHl-B-sYeWU",
  authDomain: "qwitter-c03fd.firebaseapp.com",
  projectId: "qwitter-c03fd",
  storageBucket: "qwitter-c03fd.appspot.com",
  messagingSenderId: "386912521263",
  appId: "1:386912521263:web:fa3a953175859aeea0cada"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db
