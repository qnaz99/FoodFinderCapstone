// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWAH2eOqoKjKWR_khV6x5tGrD8GqgEN5o",
  authDomain: "capstone-2129c.firebaseapp.com",
  projectId: "capstone-2129c",
  storageBucket: "capstone-2129c.appspot.com",
  messagingSenderId: "1000564568923",
  appId: "1:1000564568923:web:e385def47f8889a353a07e"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
export { firebase};