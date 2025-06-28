import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data || null);
    } catch {
      if (import.meta.env.DEV) {
        console.info("Auth fetchUser: not logged in (expected for guests)");
      }
      setUser(null);
    }
  };

  useEffect(() => {
    async function init() {
      await fetchUser();
      setLoading(false); // ✅ only after user fetch completes
    }
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
