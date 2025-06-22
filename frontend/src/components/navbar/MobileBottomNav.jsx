import {
  Compass,
  Home,
  Search,
  PlusCircle,
  User,
  Newspaper,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MobileExplorePopover } from "./MobileExplorePopover";

export function MobileBottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const baseItemClass =
    "flex flex-col items-center text-xs text-stone-300 hover:text-white transition";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#2f1f1c] border-t border-[#4a2f2b] z-50 md:hidden shadow-inner">
      <div className="flex justify-around items-center py-2 px-2">
        <Link to="/" className={baseItemClass}>
          <Home className="h-6 w-6" />
          Home
        </Link>

        <Link to="/feed" className={baseItemClass}>
          <Newspaper className="h-6 w-6" />
          Feed
        </Link>

        {/* <button className={baseItemClass}>
          <Search className="h-6 w-6" />
          Search
        </button> */}

        <Link to="/post">
          <button className={baseItemClass}>
            <PlusCircle className="h-6 w-6" />
            Post
          </button>
        </Link>

        {/* Explore */}
        <MobileExplorePopover />

        {user ? (
          <Link to="/profile" className={baseItemClass}>
            <User className="h-6 w-6" />
            Profile
          </Link>
        ) : (
          <button
            onClick={() =>
              navigate("/auth", { state: { from: location.pathname } })
            }
            className={baseItemClass}
          >
            <User className="h-6 w-6" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
