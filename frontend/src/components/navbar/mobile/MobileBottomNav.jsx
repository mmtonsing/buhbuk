import { Home, PlusCircle, User, Newspaper } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MobileVarietyPopover } from "./MobileVarietyPopover";

export function MobileBottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const baseItemClass =
    "flex flex-col items-center text-xs text-stone-300 hover:text-white transition";

  return (
    <nav
      className="fixed bottom-0 left-0 w-full h-16 bg-[#2f1f1c] border-t border-[#4a2f2b] z-40 md:hidden shadow-inner"
      style={{
        backgroundColor: "#2f1f1c",
        borderTop: "1px solid #4a2f2b",
        paddingBottom: "env(safe-area-inset-bottom)",
        minHeight: "4rem",
        backgroundClip: "content-box",
      }}
    >
      <div className="flex justify-around items-center py-2 px-2">
        <Link to="/" className={baseItemClass}>
          <Home className="h-6 w-6" />
          Buk
        </Link>

        <Link to="/harvests" className={baseItemClass}>
          <Newspaper className="h-6 w-6" />
          Harvests
        </Link>

        {/* <button className={baseItemClass}>
          <Search className="h-6 w-6" />
          Search
        </button> */}

        {user && (
          <Link to="/sow">
            <button className={baseItemClass}>
              <PlusCircle className="h-6 w-6" />
              Sow
            </button>
          </Link>
        )}

        {/* Explore */}
        <MobileVarietyPopover />

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
