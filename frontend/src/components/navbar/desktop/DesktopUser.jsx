import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useLogoutHandler } from "@/utils/handleLogout";
import { User } from "lucide-react";

export default function DesktopUser() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogoutHandler();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="hidden md:inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
      >
        Login / Signup
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-stone-100 hover:bg-stone-800 hover:text-orange-300 transition-colors">
        <User className="h-5 w-5 text-green-500" />
        <span>{user.username}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-2 bg-stone-900 text-stone-200 border border-stone-700 shadow-xl"
      >
        <DropdownMenuLabel className="text-orange-400">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-stone-700" />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => navigate("/settings")}>
          Settings
        </DropdownMenuItem> */}
        <DropdownMenuSeparator className="bg-stone-700" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
