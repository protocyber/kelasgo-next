"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "@/screens/login/login.api";
import { refreshToken as refreshTokenApi } from "@/lib/refresh-token.api";

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
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scheduleTokenRefreshRef = useRef<((expiresAt: string) => void) | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_expires_at");

    // Remove cookie
    document.cookie = "token=; path=/; max-age=0";

    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    setUser(null);
    router.push("/login");
  }, [router]);

  // Function to schedule token refresh
  const scheduleTokenRefresh = useCallback((expiresAt: string) => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;

    // Refresh 5 minutes before expiry (300000 ms = 5 minutes)
    const refreshTime = timeUntilExpiry - 300000;

    // Function to refresh
    const performRefresh = async () => {
      try {
        const storedRefreshToken = localStorage.getItem("refresh_token");

        if (!storedRefreshToken) {
          logout();
          return;
        }

        const data = await refreshTokenApi(storedRefreshToken);

        // Update stored tokens
        localStorage.setItem("token", data.token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("expires_at", data.expires_at);
        localStorage.setItem("refresh_expires_at", data.refresh_expires_at);

        // Update cookie for middleware
        document.cookie = `token=${data.token}; path=/; max-age=86400`; // 1 day

        // Schedule next refresh using ref
        if (scheduleTokenRefreshRef.current) {
          scheduleTokenRefreshRef.current(data.expires_at);
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
      }
    };

    // Only schedule if there's time left
    if (refreshTime > 0) {
      refreshTimerRef.current = setTimeout(() => {
        performRefresh();
      }, refreshTime);
    } else if (timeUntilExpiry > 0) {
      // If less than 5 minutes until expiry, refresh immediately
      performRefresh();
    }
  }, [logout]);

  // Store the function in ref so it can be called recursively
  useEffect(() => {
    scheduleTokenRefreshRef.current = scheduleTokenRefresh;
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const expiresAt = localStorage.getItem("expires_at");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));

        // Schedule token refresh if we have an expiry time
        if (expiresAt) {
          scheduleTokenRefresh(expiresAt);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [scheduleTokenRefresh]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string; }) => {
      return loginApi({ email, password });
    },
    onSuccess: (data) => {
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.full_name,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("expires_at", data.expires_at);
      localStorage.setItem("refresh_expires_at", data.refresh_expires_at);

      // Set cookie for middleware
      document.cookie = `token=${data.token}; path=/; max-age=86400`; // 1 day

      setUser(user);

      // Schedule token refresh
      scheduleTokenRefresh(data.expires_at);

      router.push("/dashboard");
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
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
