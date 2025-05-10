import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "homemaker" | "customer";
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showSignUpModal: boolean;
  setShowSignUpModal: (show: boolean) => void;
  userRole: "homemaker" | "customer" | null;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  role: "homemaker" | "customer";
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for existing auth on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      setShowLoginModal(false);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      setShowSignUpModal(false);
      toast({
        title: "Registration successful",
        description: `Welcome to EmpowerHer, ${data.user.username}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const authContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    showLoginModal,
    setShowLoginModal,
    showSignUpModal,
    setShowSignUpModal,
    userRole: user ? user.role : null,
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}