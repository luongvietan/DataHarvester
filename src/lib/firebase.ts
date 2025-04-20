// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa2RbE4cUYGZbdQeXywpwlGs8og53Arb4",
  authDomain: "dataharvester-233d8.firebaseapp.com",
  projectId: "dataharvester-233d8",
  storageBucket: "dataharvester-233d8.firebasestorage.app",
  messagingSenderId: "96074541154",
  appId: "1:96074541154:web:d19c2f26203ab33866893b",
  measurementId: "G-SLW7CLRQ5M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };
