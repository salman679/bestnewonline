"use client";
import { createContext, useEffect, useState, useContext } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "../../firebase/firebase.init";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../lib/axiosInstanace";

export const AuthContext = createContext({
  user: null,
  setUser: () => { },
  loading: true,
  setLoading: () => { },
  createUser: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
  updateUserProfile: () => Promise.resolve(),
});


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };


  const logOut = async () => {
    setLoading(true)
    return signOut(auth)
  }
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await axiosInstance.get(`/auth/user/${currentUser.uid}`);


          setUser({ ...currentUser, Database: res.data });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data.");
        } finally {
          setLoading(false);
        }
      } else {
        // If no user is authenticated
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth]);


  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;