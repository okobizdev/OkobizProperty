"use client"
import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthServices } from "@/services/auth/auth.service";
import AuthContext from "@/contexts/AuthContext";
import { RefreshTokenResponse } from "@/types/authTypes";
import { useRouter } from "next/navigation";

const { processRefreshToken } = AuthServices;

interface ExtendedJwtPayload extends JwtPayload {
  name?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: ExtendedJwtPayload | null;
  setUser: (user: ExtendedJwtPayload | null) => void;
  login: (tokens: { accessToken: string }) => void;
  isAuthenticated: boolean;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<ExtendedJwtPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem("hasLoggedOut", "true");
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const res = (await processRefreshToken()) as RefreshTokenResponse;
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      const decoded = jwtDecode<ExtendedJwtPayload>(accessToken);
      setUser(decoded);
      setIsAuthenticated(true);
      console.log("Token refreshed successfully");
    } catch (error) {
      logout();
      router.push("/rent");
      console.error("Refresh token failed:", error);
    }
  }, [logout, router]);

  useEffect(() => {
    const checkToken = async () => {
      const hasLoggedOut = localStorage.getItem("hasLoggedOut");
      if (hasLoggedOut) {
        localStorage.removeItem("hasLoggedOut");
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const decoded = jwtDecode<ExtendedJwtPayload>(accessToken);
          const isExpired = decoded.exp
            ? decoded.exp * 1000 < Date.now()
            : true;

          if (isExpired) {
            await refreshToken();
          } else {
            setUser(decoded);
            setIsAuthenticated(true);
          }
        } catch (err) {
          await refreshToken();
          console.log(err);
        }
      }
    };

    checkToken();
  }, [refreshToken]);

  const login = ({ accessToken }: { accessToken: string }) => {
    localStorage.setItem("accessToken", accessToken);
    const decoded = jwtDecode<ExtendedJwtPayload>(accessToken);
    setUser(decoded);
    setIsAuthenticated(true);
  };

  const value: AuthContextType = {
    user,
    setUser,
    login,
    isAuthenticated,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
