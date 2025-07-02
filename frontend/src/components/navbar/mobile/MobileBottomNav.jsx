import { Home, PlusCircle, User, Newspaper } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MobileVarietyPopover } from "./MobileVarietyPopover";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export function MobileBottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const width = useWindowWidth();
  if (width >= 900) return null;

  const baseItemClass =
    "flex flex-col items-center gap-0.5 text-xs font-medium text-stone-300 hover:text-amber-300 transition";

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 border-t border-[#4a2f2b] bg-[#2f1f1c] shadow-inner backdrop-blur-md">
      <div className="flex justify-around items-center h-16 px-2">
        <Link to="/" className={baseItemClass} aria-label="Home">
          <Home className="h-6 w-6" />
          Buk
        </Link>

        <Link to="/harvests" className={baseItemClass} aria-label="Harvests">
          <Newspaper className="h-6 w-6" />
          Harvests
        </Link>

        {user && (
          <Link
            to="/sow"
            className={baseItemClass}
            aria-label="Create New Post"
          >
            <PlusCircle className="h-6 w-6" />
            Sow
          </Link>
        )}

        <MobileVarietyPopover />

        {user ? (
          <Link to="/profile" className={baseItemClass} aria-label="Profile">
            <User className="h-6 w-6" />
            Profile
          </Link>
        ) : (
          <button
            onClick={() =>
              navigate("/auth", { state: { from: location.pathname } })
            }
            className={baseItemClass}
            aria-label="Login"
          >
            <User className="h-6 w-6" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
