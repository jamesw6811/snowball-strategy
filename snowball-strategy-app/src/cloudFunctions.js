import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY_SNOWBALL,
  authDomain: "snowball-strategy.firebaseapp.com",
  projectId: "snowball-strategy",
  storageBucket: "snowball-strategy.appspot.com",
  messagingSenderId: "963604328150",
  appId: "1:963604328150:web:db6eef1145ff3dc306e377",
  measurementId: "G-JXX5K651FV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const runGPTCompletion = async (prompt) => {
    const addMessage = httpsCallable(functions, 'queryGPTCompletion');
    const result = await addMessage({ prompt: prompt });
    return result.data.text;
}

export {runGPTCompletion};