// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUUX-8QymIur7ue21661g1wWgzZPS-YYU",
  authDomain: "inventory-management-3a777.firebaseapp.com",
  projectId: "inventory-management-3a777",
  storageBucket: "inventory-management-3a777.appspot.com",
  messagingSenderId: "1098487418707",
  appId: "1:1098487418707:web:e2649c087b0639caed5ba6",
  measurementId: "G-W9LFQCKP9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
