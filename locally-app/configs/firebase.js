import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClsEARBNkZsal7p4EIH3VRFjVV9d_n4EE",
  authDomain: "locally-c61ed.firebaseapp.com",
  projectId: "locally-c61ed",
  storageBucket: "locally-c61ed.firebasestorage.app",
  messagingSenderId: "21323472002",
  appId: "1:21323472002:web:adab0901ecc69fac9be89b"
};

// Initialize Firebase
const Firebase_App = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const Firebase_Auth = initializeAuth(Firebase_App, {
  persistence: getReactNativePersistence(AsyncStorage)
});