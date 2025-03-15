
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "./use-local-storage";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  provider: string | null;
  avatarUrl: string | null;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (provider: "google" | "github") => void;
  logout: () => void;
  getAnonymousId: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock OAuth login for demo purposes
const mockOAuthLogin = async (provider: string): Promise<User> => {
  // In a real implementation, this would redirect to the OAuth provider
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: uuidv4(),
        name: `User from ${provider}`,
        email: `user@${provider.toLowerCase()}.example.com`,
        provider,
        avatarUrl: null,
        isAnonymous: false,
      });
    }, 1000);
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [anonymousId] = useLocalStorage("nameswap-anonymous-id", uuidv4());
  const [user, setUser] = useLocalStorage<User | null>("nameswap-user", null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use a library like @auth/react
      const user = await mockOAuthLogin(provider);
      setUser(user);
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const getAnonymousId = () => {
    return anonymousId;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        getAnonymousId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
