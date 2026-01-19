import { createContext } from "react";

interface ExtendedJwtPayload {
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  isVerified?: boolean;
  userId?: string;
}

interface AuthContextType {
  user: ExtendedJwtPayload | null;
  setUser: (user: ExtendedJwtPayload | null) => void;
  login: (tokens: { accessToken: string }) => void;
  isAuthenticated: boolean;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
