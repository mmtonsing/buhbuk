import { Link, useLocation } from "react-router-dom";
import { pageData } from "./pageData";
import { DesktopVariety } from "./DesktopVariety";
import { useAuth } from "@/context/AuthContext";
import { getVisiblePages } from "@/utils/getVisiblePages";

function NavLinkItem({ page, isActive }) {
  return (
    <Link
      to={page.path}
      className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
        ${
          isActive
            ? "text-[#e0c9a6] bg-[#4b2e2b] shadow-md border-b border-[#6b4226]/50"
            : "text-stone-100 hover:text-buhbukAccent hover:bg-[#2d1c1a]"
        }
        focus:outline-none focus:bg-[#4b2e2b] focus:text-[#e0c9a6] focus:shadow-md focus:border-b focus:border-[#6b4226]/50`}
    >
      {page.name}
      {isActive && (
        <span className="absolute left-2 right-2 bottom-1 h-[2px] bg-[#e0c9a6] rounded-full" />
      )}
    </Link>
  );
}

export function DesktopNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const visiblePages = getVisiblePages(pageData, user);

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-2 items-center">
        {visiblePages.map((page) => {
          const isActive = pathname === page.path;
          return (
            <li key={page.path}>
              <NavLinkItem page={page} isActive={isActive} />
            </li>
          );
        })}
        <li>
          <DesktopVariety />
        </li>
      </ul>
    </nav>
  );
}
