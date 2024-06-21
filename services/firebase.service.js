import { getApp, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth,getReactNativePersistence  } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getStorage ,ref} from 'firebase/storage';
import { AppRegistry } from 'react-native';
import { name as appName } from '../app.json';

import 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDdxP5OE_Xw0ELYLS6aEVItK4mS2mRzHoU",
  authDomain: "sportpit-47d69.firebaseapp.com",
  projectId: "sportpit-47d69",
  storageBucket: "sportpit-47d69.appspot.com",
  messagingSenderId: "381561802490",
  appId: "1:381561802490:web:d948aadb4cb1ae4edb0343",
  measurementId: "G-N6HSTTZF4M"
};
  const app = initializeApp(firebaseConfig);  
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  export { db, storage,ref};