import React, { createContext, useState, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../Config/firbase";

type UserContextIdType = {
  userContextId: string | null;
  setUserId: (id: string | null) => void;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContextId = createContext<UserContextIdType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userContextId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUserId(userCredential.user.uid);
      console.log("User registered successfully!");
    } catch (error: any) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUserId(userCredential.user.uid);
      console.log("User logged in!");
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      console.log("User logged out!");
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  return (
    <UserContextId.Provider
      value={{ userContextId, setUserId, loading, signUp, login, logout }}
    >
      {children}
    </UserContextId.Provider>
  );
};

export const useUserContextId = () => {
  const context = useContext(UserContextId);
  if (!context) {
    throw new Error("useUserContextId must be used within a UserProvider");
  }
  return context;
};

export default UserContextId;
