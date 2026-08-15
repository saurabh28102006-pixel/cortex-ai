// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDzDvMJdPP6l_qkDWkurWM3-XO14EAHsW0",
  authDomain: "cortexai-36c87.firebaseapp.com",
  projectId: "cortexai-36c87",
  storageBucket: "cortexai-36c87.firebasestorage.app",
  messagingSenderId: "778908436753",
  appId: "1:778908436753:web:72a541fefdb83b6bcce4b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()