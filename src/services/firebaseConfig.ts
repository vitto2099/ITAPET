import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAojVylRmlIgqBPVrRHTIWiLeFcVrzDIvM",
  authDomain: "itapet-354d4.firebaseapp.com",
  projectId: "itapet-354d4",
  storageBucket: "itapet-354d4.firebasestorage.app",
  messagingSenderId: "493977798545",
  appId: "1:493977798545:web:ec44b43ead4f33b7b4bc30"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);