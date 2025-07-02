import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { pageDataMobile } from "./pageDataMobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useLogoutHandler } from "@/utils/handleLogout";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export default function MobileNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogoutHandler();
  const width = useWindowWidth();
  if (width >= 900) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation"
          className="p-2 rounded-md hover:bg-stone-800 transition"
        >
          <Menu className="w-6 h-6 text-stone-100" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-64 bg-[#1e1513] text-stone-200 border-l border-[#3b2a26] px-4 py-4"
      >
        <SheetClose asChild>
          <button
            className="absolute top-5 right-5 p-1 rounded-full hover:bg-[#2e1f1b] transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </SheetClose>

        {/* Header */}
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl [font-family:var(--font-logo)] bg-gradient-to-r from-[#f3d6a4] to-[#b47f4e] bg-clip-text text-transparent tracking-wide">
            BuhBuk
          </SheetTitle>
        </SheetHeader>

        {/* Navigation links */}
        <nav className="flex flex-col gap-2">
          {pageDataMobile.map((page) => (
            <SheetClose asChild key={page.path}>
              <Link to={page.path} className="nav-link-mobile">
                {page.name}
              </Link>
            </SheetClose>
          ))}

          <hr className="my-3 border-[#3b2a26]" />

          {/* Auth buttons */}
          {user ? (
            <>
              <SheetClose asChild>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-sm text-left px-3 py-2 rounded-md hover:bg-[#3b2a26] transition"
                >
                  Profile
                </button>
              </SheetClose>

              <SheetClose asChild>
                <button
                  onClick={handleLogout}
                  className="text-sm text-left px-3 py-2 rounded-md text-red-500 hover:bg-[#3b2a26] transition"
                >
                  Logout
                </button>
              </SheetClose>
            </>
          ) : (
            <SheetClose asChild>
              <button
                onClick={() => navigate("/auth")}
                className="btn-buhbuk w-full text-center py-2 text-sm mt-2"
              >
                Login / Signup
              </button>
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
