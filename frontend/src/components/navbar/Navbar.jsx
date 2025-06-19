import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logoutHandler";
import { useAuth } from "../../context/AuthContext";
import { useScrollTrigger } from "../../utils/useScrollTrigger";
import { DesktopNav } from "./DesktopNav";
import DesktopUser from "./DesktopUser";
import MobileNav from "./MobileNavSheet";
import { MobileBottomNav } from "./MobileBottomNav";
import { HutIcon } from "../../assets/HutIcon";

export function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const scrolled = useScrollTrigger(20); // adds shadow after scroll

  const onLogout = () => {
    handleLogout(navigate, setUser);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#4b2e2b] shadow-md border-b border-[#6b4226]/50"
          : "bg-gradient-to-r from-[#4b2e2b] to-[#6b4226] text-stone-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo + Title */}
        {/* <div className="flex items-center gap-3">
          <HutIcon className="w-10 h-10 text-green-600 drop-shadow-md" />
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-green-500 hover:text-green-400 transition-colors"
          >
            BukWarm
          </Link>
        </div> */}
        <div className="flex items-center gap-3">
          <HutIcon className="w-10 h-10 text-[#ff7746] drop-shadow-md" />
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-[#ffb347] to-[#ff7746] bg-clip-text text-transparent tracking-wide"
          >
            BukWarm
          </Link>
        </div>

        {/* Desktop Nav - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <DesktopNav />
          <DesktopUser onLogout={onLogout} />
        </div>

        {/* Mobile Nav - Only visible on small screens */}
        <div className="md:hidden flex items-center gap-2">
          <MobileNav />
        </div>
      </div>

      {/* Bottom Mobile Nav (like Instagram/YouTube style) */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </header>
  );
}
