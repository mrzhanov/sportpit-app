// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { getAuth } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const unsubscribe = getAuth().onAuthStateChanged((user) => {
          setCurrentUser(user);
          setLoading(false);
          console.log(currentUser);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await firebase.auth().signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
