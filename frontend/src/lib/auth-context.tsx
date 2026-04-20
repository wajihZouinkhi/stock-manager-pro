"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, User, getToken, setToken, clearToken } from "./api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      if (!PUBLIC_PATHS.includes(pathname)) router.replace("/login");
      return;
    }
    authApi.me()
      .then((u) => setUser(u))
      .catch(() => { clearToken(); if (!PUBLIC_PATHS.includes(pathname)) router.replace("/login"); })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.access_token);
    setUser(res.user);
    router.replace("/dashboard");
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    const res = await authApi.register(data);
    setToken(res.access_token);
    setUser(res.user);
    router.replace("/dashboard");
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
