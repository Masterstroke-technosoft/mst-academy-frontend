"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthUser } from "@/lib/auth";
import { getSession, logout as authLogout, updateUser } from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  refresh: () => void;
  logout: () => void;
  isAdmin: boolean;
  updateProfile: (updates: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  refresh: () => { },
  logout: () => { },
  isAdmin: false,
  updateProfile: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(getSession());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<AuthUser>) => {
      if (user) {
        updateUser(user.id, updates);
        refresh();
      }
    },
    [user, refresh]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        refresh,
        logout,
        isAdmin: user?.role === "admin" || user?.role === "ADMIN",
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
