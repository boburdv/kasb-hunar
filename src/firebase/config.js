import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC86iiVr3t-iwbvU9IyNb6Xa6tYsUJ9iV4",
  authDomain: "politexnikum-4b6a2.firebaseapp.com",
  projectId: "politexnikum-4b6a2",
  storageBucket: "politexnikum-4b6a2.firebasestorage.app",
  messagingSenderId: "568577972478",
  appId: "1:568577972478:web:1ce3aefdea2d4f50736daf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
