import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

export function UserBadge({ user, className = "" }) {
  if (!user) return null;

  return (
    <Link
      to={`/user/${user._id}`}
      className={`group inline-flex items-center gap-2 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-blue-500 transition-all duration-150 ${className}`}
    >
      {/* Avatar Placeholder */}
      <div className="w-6 h-6 rounded-full bg-stone-900 border border-stone-600 flex items-center justify-center group-hover:border-blue-400">
        <UserCircle className="w-4 h-4 text-stone-400 group-hover:text-blue-400" />
      </div>

      {/* Username */}
      <span className="text-sm text-stone-100 group-hover:text-blue-400 transition-colors">
        {user.username}
      </span>
    </Link>
  );
}
