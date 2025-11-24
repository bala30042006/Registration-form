import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-G7FkAc0Utrv9uQolXSdN84B9_G5HOh8",
  authDomain: "task-94d80.firebaseapp.com",
  projectId: "task-94d80",
  storageBucket: "task-94d80.firebasestorage.app",
  messagingSenderId: "254568180802",
  appId: "1:254568180802:web:cd045a7a1a7905cd4511db",
  measurementId: "G-LBNZZHH4NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

console.log("✓ Firebase connected successfully!");