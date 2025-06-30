import { Link } from "react-router-dom";
import { useLogoutHandler } from "@/utils/handleLogout";
import { useScrollTrigger } from "@/utils/useScrollTrigger";
import { DesktopNav } from "./desktop/DesktopNav";
import DesktopUser from "./desktop/DesktopUser";
import MobileNav from "./mobile/MobileNavSheet";
import { MobileBottomNav } from "./mobile/mobileBottomNav";
import logo from "@/assets/logo-eimibuk.png";

export function Navbar() {
  const scrolled = useScrollTrigger(20); // adds shadow after scroll
  const handleLogout = useLogoutHandler();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#4b2e2b] shadow-md border-b border-[#6b4226]/50"
          : "bg-gradient-to-r from-[#4b2e2b] to-[#6b4226] text-stone-100"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          to="/about"
          className="flex items-center gap-3 text-2xl font-extrabold bg-gradient-to-r from-[#d5bdaf] to-[#988276] bg-clip-text text-transparent tracking-wide"
        >
          <img
            src={logo}
            alt="EimiBuk logo"
            className="w-10 h-10 drop-shadow-md"
          />
          EimiBuk
        </Link>

        {/* Desktop Nav - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <DesktopNav />
          <DesktopUser onLogout={handleLogout} />
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
