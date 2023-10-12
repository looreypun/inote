import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA7y9QVG9A7rbYxA7F79EfQIawRlnGamTY",
    authDomain: "react-native-927b3.firebaseapp.com",
    projectId: "react-native-927b3",
    storageBucket: "react-native-927b3.appspot.com",
    messagingSenderId: "171980146933",
    appId: "1:171980146933:web:49cdef65b61bd2304c5dbc"
};

let app, auth, db;

if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
        // db = initializeFirestore(app, auth);
        db = getFirestore(app);
    } catch (error) {
        console.log("Error initializing app: " + error);
    }
} else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}

export { auth, db };

