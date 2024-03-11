// firebase.jsx

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKDibveNEUmZbt40HrFaJO9Aiw9UjLeFM",
  authDomain: "notes-app-fbda5.firebaseapp.com",
  projectId: "notes-app-fbda5",
  storageBucket: "notes-app-fbda5.appspot.com",
  messagingSenderId: "421426691194",
  appId: "1:421426691194:web:3ffe6ba10e8351f85d8fc3",
  measurementId: "G-2TLQ6TZ0VB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };

