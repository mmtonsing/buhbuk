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
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogoutHandler();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="btn-buhbuk hidden md:inline-block text-sm px-4 py-2"
      >
        Login / Signup
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-stone-100 hover:bg-[#3b2a26] hover:text-orange-300 transition">
        <User className="h-5 w-5 text-green-500" />
        <span>{user.username}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mt-2 bg-[#2f1f1c] text-stone-200 border border-[#4a2f2b] shadow-xl rounded-xl w-40"
      >
        <DropdownMenuLabel className="text-orange-400 font-semibold px-3 py-1.5">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#4a2f2b]" />
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="hover:bg-[#3b2a26] cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#4a2f2b]" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
