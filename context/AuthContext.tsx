import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "mypharma_user";

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    name: "Kofi Mensah",
    email: "kofi@example.com",
    phone: "+225 07 12 34 56",
    password: "password123",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(USER_KEY).then((data) => {
      if (data) setUser(JSON.parse(data));
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, phone: string, _password: string) => {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
      };
      setUser(newUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return true;
    },
    []
  );

  const signOut = useCallback(() => {
    setUser(null);
    AsyncStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
