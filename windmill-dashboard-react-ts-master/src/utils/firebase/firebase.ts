import firebase from "firebase";
import 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAfVhEHmTxFDWsBLqC9o2kHg3w7hhVsVKA",
  authDomain: "gsms-41f9a.firebaseapp.com",
  projectId: "gsms-41f9a",
  storageBucket: "gsms-41f9a.appspot.com",
  messagingSenderId: "835304842718",
  appId: "1:835304842718:web:0d13df914130651a2de94f",
  measurementId: "G-TXVW1538QX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
export { firebase, storage }