//utils/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPDLrlb3Yanqv-JPQrO6pMx1746BgCYeY",
  authDomain: "image-storage-e9071.firebaseapp.com",
  projectId: "image-storage-e9071",
  storageBucket: "image-storage-e9071.firebasestorage.app",
  messagingSenderId: "875342069415",
  appId: "1:875342069415:web:975e52f6afc94403022582",
  measurementId: "G-20KSK07488"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const storage = getStorage(app);