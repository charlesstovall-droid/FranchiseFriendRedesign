import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";

interface Member {
  id: string;
  email: string;
  name: string;
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;
  phase4Complete: boolean;
  createdAt: string;
}

interface AuthContextType {
  member: Member | null;
  loading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMember(data.member);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        member,
        loading,
        isLoggedIn: !!member,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useProtectedRoute() {
  const { member, loading, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setLocation("/client-portal");
    }
  }, [loading, isLoggedIn, setLocation]);

  return { member, loading, isLoggedIn };
}
