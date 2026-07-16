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

// Installed at module-evaluation time (not inside a useEffect) so it is in
// place before any descendant component's mount-time effects fire — React
// runs child effects before parent effects, so patching fetch from inside
// AuthProvider's own useEffect would miss requests fired by children on
// initial mount.
if (typeof window !== "undefined" && !(window as any).__mstFetchPatched) {
  (window as any).__mstFetchPatched = true;
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const response = await originalFetch(input, init);
    if (response.status === 401) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : input.toString();
      const isAuthFlowEndpoint = /\/api\/auth\/(login|register|forgot-password|clear-session)/.test(url);
      if (!isAuthFlowEndpoint && window.location.pathname !== "/login") {
        authLogout();
        window.location.href = "/login";
      }
    }
    return response;
  };
}

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
