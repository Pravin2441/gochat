import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyAaFiMBltCYQUVpXssVSNmRMb1Q9PWgJOA",
    authDomain: "gochat-fef9f.firebaseapp.com",
    projectId: "gochat-fef9f",
    storageBucket: "gochat-fef9f.appspot.com",
    messagingSenderId: "945786104101",
    appId: "1:945786104101:web:590fd8bb84e4b4f4e252cc"
};

firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
