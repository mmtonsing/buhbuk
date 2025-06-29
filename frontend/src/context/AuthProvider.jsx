import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser } from "@/api/usersApi";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data || null);
    } catch {
      setUser(null); // 🔇 silent fail — no console logs here
    }
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
