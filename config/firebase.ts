import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyBfTFtG4pvf6EU9J_ik1wheBBMncwAg1iM',
  authDomain: 'soil-pulse-d23ea.firebaseapp.com',
  projectId: 'soil-pulse-d23ea',
  storageBucket: 'soil-pulse-d23ea.firebasestorage.app',
  messagingSenderId: '545096897389',
  appId: '1:545096897389:web:037d107599ea303e450064',
  measurementId: 'G-SRP8CJGFQ7',
};

const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

export const db = getFirestore(app);
export const storage = getStorage(app);

export const analytics = null;

export default app;
