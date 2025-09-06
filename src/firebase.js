// Firebase configuration with necessary imports
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY', // Replace with your API Key
  authDomain: 'YOUR_AUTH_DOMAIN', // Replace with your Auth Domain
  projectId: 'YOUR_PROJECT_ID', // Replace with your Project ID
  storageBucket: 'YOUR_STORAGE_BUCKET', // Replace with your Storage Bucket
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID', // Replace with your Messaging Sender ID
  appId: 'YOUR_APP_ID' // Replace with your App ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
