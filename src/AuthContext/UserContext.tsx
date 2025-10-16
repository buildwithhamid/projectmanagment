import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config/firbase";

type UserContextIdType = {
  userContextId: string | null;
  setUserId: (id: string | null) => void;
  loading: boolean;
};

const UserContextId = createContext<UserContextIdType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userContextId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ? user?.uid : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContextId.Provider value={{ userContextId, setUserId, loading }}>
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
