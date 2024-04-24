import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAp91j2RrC9Mx708BmW8mkmQ9nATUrlUpw',
  authDomain: 'hikingbuddy-4abda.firebaseapp.com',
  projectId: 'hikingbuddy-4abda',
  storageBucket: 'hikingbuddy-4abda.appspot.com',
  messagingSenderId: '326013852726',
  appId: '1:326013852726:web:391a4a584524bdb3d30c97',
  measurementId: 'G-FRJBNLQG5D',
};

// Connect to your Firebase app
const app = initializeApp(firebaseConfig);
// Connect to your Firestore database
const db = getFirestore(app);
export default db;
// Connect to Firebase auth
export const auth = getAuth(app);

export const storage = getStorage();
