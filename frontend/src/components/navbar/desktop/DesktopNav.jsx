import { Link, useLocation } from "react-router-dom";
import { pageData } from "./pageData";
import { DesktopExplore } from "./DesktopExplore";
import { useAuth } from "@/context/AuthContext";
import { getVisiblePages } from "@/utils/getVisiblePages";

export function DesktopNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const visiblePages = getVisiblePages(pageData, user);

  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-2 items-center">
        {visiblePages.map((page) => {
          const isActive = pathname === page.path;

          return (
            <li key={page.path}>
              <Link
                to={page.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "text-orange-400 bg-[#4b2e2b] shadow-md border-b border-[#6b4226]/50"
                      : "text-stone-100 hover:text-orange-300 hover:bg-[#2d1c1a]"
                  }
                  focus:outline-none focus:bg-[#4b2e2b] focus:text-orange-300 focus:shadow-md focus:border-b focus:border-[#6b4226]/50`}
              >
                {page.name}
                {isActive && (
                  <span className="absolute left-2 right-2 bottom-1 h-[2px] bg-orange-400 rounded-full" />
                )}
              </Link>
            </li>
          );
        })}

        <li>
          <DesktopExplore />
        </li>
      </ul>
    </nav>
  );
}
