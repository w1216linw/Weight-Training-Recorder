"use client";

import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { createContext, ReactNode, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
};

const defaultAuthContext = {
  user: undefined,
  loading: false,
  error: undefined,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
