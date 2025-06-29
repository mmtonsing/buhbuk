import { logoutUser, getCurrentUser } from "../api/usersApi";
import { toast } from "sonner";

export async function handleLogout(navigate, setUser) {
  try {
    const currentUser = await getCurrentUser();
    const username = currentUser?.username || "User";

    await logoutUser();
    setUser(null);
    toast.success(`👋 ${username} has logged out.`);

    // Delay navigation for 0.01s
    setTimeout(() => {
      navigate("/");
    }, 10);

    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Try again.");
    return false;
  }
}
