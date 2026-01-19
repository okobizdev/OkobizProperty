import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

const useAccess = () => {
  const token = localStorage.getItem("accessToken");
  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  return {
    isAuthenticated: !!user,
    user,
    token
  };
};

export default useAccess;