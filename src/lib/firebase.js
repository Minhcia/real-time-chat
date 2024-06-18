
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";







const firebaseConfig = {
  apiKey: "AIzaSyCMmghkeW3jPCY0m2DZQ8k6S_5lpVPU0Pg",
  authDomain: "real-time-chat-2d902.firebaseapp.com",
  projectId: "real-time-chat-2d902",
  storageBucket: "real-time-chat-2d902.appspot.com",
  messagingSenderId: "1084860907476",
  appId: "1:1084860907476:web:1613cb066105fb84afe041",
  measurementId: "G-P6V20GMKMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();