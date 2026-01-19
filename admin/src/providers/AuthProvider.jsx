import React, { useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import AuthServices from "../services/auth.services";
import AuthContext from "../contexts/AuthContext";
const { processRefreshToken } = AuthServices;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = ({ accessToken }) => {
    localStorage.setItem("accessToken", accessToken);
    const data = jwtDecode(accessToken);
    setUser(data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      const res = await processRefreshToken();
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      const decoded = jwtDecode(accessToken);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      logout();
    }
  };

  useEffect(() => {
    (async () => {
      const hasLoggedOut = localStorage.getItem("hasLoggedOut");
      if (hasLoggedOut) {
        localStorage.removeItem("hasLoggedOut");
        setLoading(false);
        return;
      }
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {

        try {
          const decoded = jwtDecode(accessToken);
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded);
            setIsAuthenticated(true);
          } else {
            await refreshToken();
          }
        } catch {
          await refreshToken();
        }
      } else {
        await refreshToken();
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        isAuthenticated,
        logout,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
