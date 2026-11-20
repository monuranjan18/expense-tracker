import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeToAuthChanges,
  loginWithEmailPassword,
  registerWithEmailPassword,
  loginWithGoogle,
  logoutUser,
  updateUserProfileData,
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const u = await loginWithEmailPassword(email, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    setLoading(true);
    try {
      const u = await registerWithEmailPassword(email, password, displayName);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleAuth = async () => {
    setLoading(true);
    try {
      const u = await loginWithGoogle();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName, photoURL) => {
    const updated = await updateUserProfileData(displayName, photoURL);
    if (updated) {
      setUser((prev) => ({
        ...prev,
        displayName: displayName || prev.displayName,
        photoURL: photoURL !== undefined ? photoURL : prev.photoURL,
      }));
    }
    return updated;
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogleAuth,
    logout,
    updateProfile,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
