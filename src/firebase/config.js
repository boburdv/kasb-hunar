import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYbLXYowqJYxhKAEy9_ehwCWvofe6rPNc",
  authDomain: "kasb-hunar-410e5.firebaseapp.com",
  projectId: "kasb-hunar-410e5",
  storageBucket: "kasb-hunar-410e5.firebasestorage.app",
  messagingSenderId: "141426109226",
  appId: "1:141426109226:web:3af7d90356b91df8054c53",
  measurementId: "G-Q3S37E1V8S",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
