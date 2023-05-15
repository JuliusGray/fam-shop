import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjpZ55aEbm8rUlALTXdDkcFV5awfkdViU",
  authDomain: "web-shop-ec349.firebaseapp.com",
  databaseURL: "https://web-shop-ec349-default-rtdb.firebaseio.com",
  projectId: "web-shop-ec349",
  storageBucket: "web-shop-ec349.appspot.com",
  messagingSenderId: "715326604131",
  appId: "1:715326604131:web:1b0517f12669f9da748956",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
