import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAOg_fykxhYGlRIU3e4qfluHG_Y9dhCFew",
    authDomain: "optica-809a9.firebaseapp.com",
    projectId: "optica-809a9",
    storageBucket: "optica-809a9.appspot.com",
    messagingSenderId: "1037067930106",
    appId: "1:1037067930106:web:94af7c3ba6b6bb9802bc43"
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage().ref().child('/');