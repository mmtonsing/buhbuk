import { useNavigate, Link } from "react-router-dom";
import { Menu, X, XIcon } from "lucide-react";
import { pageDataMobile } from "./pageDataMobile.js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext.jsx";
import { useLogoutHandler } from "@/utils/handleLogout.js";

export default function MobileNav() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogoutHandler();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="w-10 h-10 text-stone-200" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-64 bg-[#1e1513] text-stone-300 border-l border-[#3b2a26] px-4 py-4"
        >
          <SheetClose
            asChild
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-6 right-9 rounded-xs opacity-80 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="size-10">X</XIcon>
          </SheetClose>
          {/* HEADER */}
          <SheetHeader>
            <div className="flex items-center gap-2 mb-4">
              <SheetTitle className="text-2xl font-extrabold bg-gradient-to-r from-[#d5bdaf] to-[#988276] bg-clip-text text-transparent tracking-wide">
                EimiBuk
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
                    onClick={handleLogout}
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
