import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export interface AppUser {
  id: number;
  username: string;
  displayName: string;
  role: "admin" | "user";
}

interface AppAuthContextType {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AppAuthContext = createContext<AppAuthContextType | null>(null);

const TOKEN_KEY = "detran_app_token";
const USER_KEY = "detran_app_user";

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.appAuth.login.useMutation();

  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const result = await loginMutation.mutateAsync({ username, password });
        setToken(result.token);
        setUser(result.user as AppUser);
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      } finally {
        setIsLoading(false);
      }
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Verificar se o token ainda é válido ao carregar
  const verifyQuery = trpc.appAuth.verify.useQuery(
    { token: token ?? "" },
    { enabled: !!token, retry: false, staleTime: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (token && verifyQuery.data === null) {
      // Token inválido ou expirado
      logout();
    }
  }, [verifyQuery.data, token, logout]);

  return (
    <AppAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AppAuthContext.Provider>
  );
}

export function useAppAuth() {
  const ctx = useContext(AppAuthContext);
  if (!ctx) throw new Error("useAppAuth must be used within AppAuthProvider");
  return ctx;
}
