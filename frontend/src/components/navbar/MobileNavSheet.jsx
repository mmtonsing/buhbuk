import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import { pageDataMobile } from "./pageDataMobile.js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/utils/logoutHandler";

export default function MobileNav() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => handleLogout(navigate, setUser);

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="w-6 h-6 text-stone-200" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-64 bg-[#1e1513] text-stone-300 border-l border-[#3b2a26] px-4 py-4"
        >
          {/* HEADER */}
          <SheetHeader>
            <div className="flex items-center gap-2 mb-4">
              <SheetTitle className="text-2xl font-extrabold bg-gradient-to-r from-[#ffb347] to-[#ff7746] bg-clip-text text-transparent tracking-wide">
                BukWarm
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* NAVIGATION */}
          <nav className="flex flex-col space-y-2">
            {pageDataMobile.map((page) => (
              <SheetClose asChild key={page.path}>
                <Link
                  to={page.path}
                  className="text-sm font-medium px-3 py-2 rounded hover:bg-[#3b2a26] transition"
                >
                  {page.name}
                </Link>
              </SheetClose>
            ))}

            <hr className="my-3 border-[#3b2a26]" />

            {/* USER ACTIONS */}
            {user ? (
              <>
                <SheetClose asChild>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-sm px-3 py-2 text-left rounded hover:bg-[#3b2a26] transition"
                  >
                    Profile
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={() => navigate("/settings")}
                    className="text-sm px-3 py-2 text-left rounded hover:bg-[#3b2a26] transition"
                  >
                    Settings
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={onLogout}
                    className="text-sm px-3 py-2 text-left text-red-500 hover:bg-[#3b2a26] transition"
                  >
                    Logout
                  </button>
                </SheetClose>
              </>
            ) : (
              <SheetClose asChild>
                <button
                  onClick={() => navigate("/auth")}
                  className="text-sm px-3 py-2 text-left bg-green-700 text-white rounded hover:bg-green-800 transition"
                >
                  Login / Signup
                </button>
              </SheetClose>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
