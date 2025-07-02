import { Link } from "react-router-dom";
import { useLogoutHandler } from "@/utils/handleLogout";
import { useScrollTrigger } from "@/utils/useScrollTrigger";
import { DesktopNav } from "./desktop/DesktopNav";
import DesktopUser from "./desktop/DesktopUser";
import MobileNav from "./mobile/MobileNavSheet";
import logo from "/logo-buhbuk.png";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export function Navbar() {
  const scrolled = useScrollTrigger(20);
  const handleLogout = useLogoutHandler();
  const width = useWindowWidth();
  const showMobile = width < 900;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#4b2e2b] shadow-md border-b border-[#6b4226]/50"
          : "bg-gradient-to-r from-[#4b2e2b] to-[#643e25]"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          to="/about"
          aria-label="Go to About BuhBuk"
          className="flex items-center gap-3 font-extrabold text-2xl sm:text-3xl tracking-wide bg-gradient-to-r from-[#f3d6a4] to-[#b47f4e] bg-clip-text text-transparent"
        >
          <img
            src={logo}
            alt="BuhBuk logo"
            className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto drop-shadow-md"
          />
          <span className="[font-family:var(--font-logo)]">BuhBuk</span>
        </Link>

        {showMobile ? (
          <MobileNav />
        ) : (
          <div className="flex items-center gap-4">
            <DesktopNav />
            <DesktopUser onLogout={handleLogout} />
          </div>
        )}
      </div>
    </header>
  );
}
