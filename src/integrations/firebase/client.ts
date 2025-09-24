
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhXo3GL9WaF2fR80El6ZiA98gQya5HM4U",
  authDomain: "safetour-bbd95.firebaseapp.com",
  projectId: "safetour-bbd95",
  storageBucket: "safetour-bbd95.appspot.com",
  messagingSenderId: "380422095594",
  appId: "1:380422095594:web:caf6eda52cb8ff0193cd93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
