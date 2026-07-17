"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AUTH_TOKEN_KEY } from "@/lib/api/client";
import { getMe, login as apiLogin, signup as apiSignup } from "@/lib/api/auth";
import type { LoginRequest, SignupRequest, UserOut } from "@/lib/types";

interface AuthContextValue {
  user: UserOut | null;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  signup: (payload: SignupRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function login(payload: LoginRequest) {
    const { access_token } = await apiLogin(payload);
    window.localStorage.setItem(AUTH_TOKEN_KEY, access_token);
    await refreshUser();
  }

  async function signup(payload: SignupRequest) {
    const { access_token } = await apiSignup(payload);
    window.localStorage.setItem(AUTH_TOKEN_KEY, access_token);
    await refreshUser();
  }

  function logout() {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
