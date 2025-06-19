import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

export function UserBadge({ user, className = "" }) {
  if (!user) return null;

  return (
    <Link
      to={`/user/${user._id}`}
      className={`group flex items-center gap-3 px-3 py-2 rounded-md bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-blue-500 transition-all duration-150 cursor-pointer ${className}`}
    >
      {/* Avatar Placeholder */}
      <div className="w-9 h-9 rounded-full bg-stone-900 border border-stone-600 flex items-center justify-center group-hover:border-blue-400">
        <UserCircle className="w-5 h-5 text-stone-400 group-hover:text-blue-400" />
      </div>

      {/* Username */}
      <span className="font-medium text-sm sm:text-base text-stone-100 group-hover:text-blue-400 transition-colors">
        {user.username}
      </span>
    </Link>
  );
}
