
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBJofeL2Jjck7iI_1EcMOk0jCj1WkQlzOY",
  authDomain: "buynestonline-82eeb.firebaseapp.com",
  projectId: "buynestonline-82eeb",
  storageBucket: "buynestonline-82eeb.firebasestorage.app",
  messagingSenderId: "303962646327",
  appId: "1:303962646327:web:66e2f74e7d9e80dd8b9cb2",
  measurementId: "G-XLDC2L778L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }