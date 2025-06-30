import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "../api/usersApi";
import { toast } from "sonner";

export function useLogoutHandler() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const username = user?.username || "User";
      await logoutUser();
      setUser(null);
      toast.success(`👋 ${username} has logged out.`);

      setTimeout(() => {
        navigate("/");
      }, 100);

      return true;
    } catch (error) {
      toast.error("Logout failed. Try again.");
      return false;
    }
  };

  return handleLogout;
}
