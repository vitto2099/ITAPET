import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "itapet-xxxxx.firebaseapp.com",
  projectId: "itapet-xxxxx",
  storageBucket: "itapet-xxxxx.appspot.com",
  messagingSenderId: "xxxxxxxx",
  appId: "xxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);