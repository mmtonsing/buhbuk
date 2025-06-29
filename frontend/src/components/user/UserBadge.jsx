import { Link } from "react-router-dom";

export function UserBadge({ user, className = "" }) {
  if (!user) return null;

  return (
    <Link
      to={`/user/${user._id}`}
      className={`group inline-flex items-center gap-2 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-blue-500 transition-all duration-150 ${className}`}
    >
      <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-900 border border-stone-600 flex items-center justify-center group-hover:border-blue-400">
        <img
          src={
            user.profilePicUrl
              ? `${user.profilePicUrl}?t=${new Date().getTime()}`
              : "/avatar.jpg"
          }
          alt="User avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/avatar.jpg";
          }}
        />
      </div>
      <span className="text-sm text-stone-100 group-hover:text-blue-400 transition-colors">
        {user.username}
      </span>
    </Link>
  );
}
