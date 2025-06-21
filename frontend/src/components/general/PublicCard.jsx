import { Link } from "react-router-dom";
import { UserBadge } from "@/pages/user/UserBadge";
import LikeWithAuth from "@/context/LikeWithAuth";

export function PublicCard({ mod3d }) {
  const date = new Date(mod3d.dateCreated);
  const stringDate = mod3d?.dateCreated
    ? date.toString().slice(4, 15)
    : "Unknown Date";

  return (
    <div className="rounded-xl bg-stone-800 hover:bg-stone-700 transition shadow-md border border-stone-700 overflow-hidden">
      {/* Entire card is clickable but only wraps image and title */}
      <Link
        to={`/viewmod3d/${mod3d._id}`}
        className="block transition-transform hover:scale-105 duration-300"
      >
        {mod3d.imageId ? (
          <img
            src={mod3d.image}
            alt={mod3d.title}
            className="w-full h-56 object-contain"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-56 bg-stone-700 flex items-center justify-center text-stone-400">
            No Image
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-semibold text-stone-100">
            {mod3d.title}
          </h3>
        </div>
      </Link>

      {/* Extra section below the clickable area */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        {mod3d.author && <UserBadge user={mod3d.author} />}
        <div className="flex items-center gap-1">
          <LikeWithAuth modId={mod3d._id} likedBy={mod3d.likedBy} />
        </div>
      </div>

      {/* Optional date below or inside LikeWithAuth row */}
      <div className="px-4 pb-3 text-xs text-stone-500">{stringDate}</div>
    </div>
  );
}
