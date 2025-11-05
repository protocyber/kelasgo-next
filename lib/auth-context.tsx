"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode; }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      // Simulate API call - replace with your actual API endpoint
      // For demo purposes, accept any email/password
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
      };

      const mockToken = "mock-jwt-token";

      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);

      // Set cookie for middleware
      document.cookie = `token=${mockToken}; path=/; max-age=86400`; // 1 day

      setUser(mockUser);

      router.push("/dashboard");
    } catch {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove cookie
    document.cookie = "token=; path=/; max-age=0";

    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
