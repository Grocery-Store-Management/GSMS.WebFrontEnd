import firebase from "firebase";
import 'firebase/storage'
// const firebaseConfig = {
//   apiKey: "AIzaSyAfVhEHmTxFDWsBLqC9o2kHg3w7hhVsVKA",
//   authDomain: "gsms-41f9a.firebaseapp.com",
//   projectId: "gsms-41f9a",
//   storageBucket: "gsms-41f9a.appspot.com",
//   messagingSenderId: "835304842718",
//   appId: "1:835304842718:web:0d13df914130651a2de94f",
//   measurementId: "G-TXVW1538QX"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBxNLlGrcTpcAYrHt2SYEYzA2faqJMCD7I",
  authDomain: "gsms-prn.firebaseapp.com",
  databaseURL: "https://gsms-prn-default-rtdb.firebaseio.com",
  projectId: "gsms-prn",
  storageBucket: "gsms-prn.appspot.com",
  messagingSenderId: "932248829437",
  appId: "1:932248829437:web:32ca60d225fc6f67b9ed94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
export { firebase, storage }