import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCk741FRvNcVswsTZPEkb8DQDr2QChpzuU",
  authDomain: "picoshot-main.firebaseapp.com",
  databaseURL:"https://picoshot-main-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "picoshot-main",
  storageBucket: "picoshot-main.firebasestorage.app",
  messagingSenderId: "333241827213",
  appId: "1:333241827213:web:d662a576c811b0ee4e87c4",
  measurementId: "G-521QE1YXQ0",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const realtimeDB = getDatabase(app);

export const storage = getStorage(app);

export const auth = getAuth();

setPersistence(auth, indexedDBLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LcikIMqAAAAAAUUwoIaEpRgaLBV2ouvHiyvqLYv"),
  isTokenAutoRefreshEnabled: true,
});

export default app;
