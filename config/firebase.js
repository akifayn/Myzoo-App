// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAemPCTtN0w8YBxK12gzlFHLt2sL7jT9jE",
  authDomain: "myzoo-4029c.firebaseapp.com",
  projectId: "myzoo-4029c",
  storageBucket: "myzoo-4029c.appspot.com",
  messagingSenderId: "767378727204",
  appId: "1:767378727204:web:5c73918001d926634753b1",
  measurementId: "G-JLDTT8BMMF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Firestore bağlantısı
