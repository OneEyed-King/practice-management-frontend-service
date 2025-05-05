// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJokEhSQ2crYLqZ6YbFz1SIjcoikYQLvo",

  authDomain: "practice-manager-webrtc.firebaseapp.com",

  projectId: "practice-manager-webrtc",

  storageBucket: "practice-manager-webrtc.firebasestorage.app",

  messagingSenderId: "203745607982",

  appId: "1:203745607982:web:a5727531874a5c7dac3abf",

  measurementId: "G-M3PK87GK00",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
