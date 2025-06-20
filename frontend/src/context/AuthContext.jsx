import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // stores {id, username, email...}
  const [loading, setLoading] = useState(true); // show loading state during fetch

  // ✅ Fetch user only once on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.error("Unexpected error fetching current user:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
