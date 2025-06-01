import {
  createContext,
  // useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { showToast } from "@/lib/toast";

type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
};

type UserAPIResponse = {
  user: User;
  access_token: string;
  token_type: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isSuccessLogin: boolean;
  error: string | null;
  register: (
    username: string,
    password: string,
    email: string,
    full_name: string,
    onSuccessRegister?: () => void
  ) => Promise<void>;
  login: (
    username: string,
    password: string,
    onSuccessLogin?: () => void
  ) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessLogin, setIsSuccessLogin] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing user in localStorage when app loads
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser).user);
        }
      } catch (err) {
        setError("Failed to load user session");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    username: string,
    password: string,
    onSuccessLogin?: () => void
  ) => {
    setLoading(true);
    setError(null);
    const BaseAPI = import.meta.env.VITE_API_URL;
    console.log(BaseAPI);
    const LoginURL = BaseAPI + "/login";

    try {
      // Replace with actual API call
      // await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      // get user data from API
      const response = await fetch(LoginURL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }).toString(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid credentials");
        }
        throw new Error("Login failed, something wrong");
      }
      const userData: UserAPIResponse = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData.user);
      setIsSuccessLogin(true);
      onSuccessLogin?.();
      showToast.success("Login successful");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      showToast.error(message);
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (onLogout?: () => void) => {
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
    onLogout?.();
    showToast.info("Logged out successfully");
  };

  const register = async () => {
    setLoading(true);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isSuccessLogin, loading, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
