import { Link } from "react-router-dom";
import { UserBadge } from "@/pages/user/UserBadge";
import LikeHandler from "@/context/LikeHandler";
import { timeAgo } from "@/utils/timeAgo";

export function ModCard({ mod3d }) {
  const displayDate = timeAgo(mod3d?.createdAt);

  return (
    <div className="block rounded-xl border border-stone-700 shadow bg-stone-800 hover:bg-stone-700 text-stone-100 overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300 group">
      <Link to={`/viewmod3d/${mod3d._id}`}>
        <div className="flex justify-center items-center bg-stone-900 h-52">
          {mod3d.imageUrl ? (
            <img
              src={mod3d.imageUrl}
              alt={mod3d.title}
              className="object-contain h-full w-full rounded-md p-2"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-500 text-center">No Image</div>
          )}
        </div>

        <div className="p-4 space-y-1">
          <h3 className="text-base font-semibold line-clamp-1">
            {mod3d.title}
          </h3>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
          {mod3d.author && (
            <UserBadge user={mod3d.author} key={mod3d.author._id} />
          )}
          <LikeHandler postId={mod3d.postId} likedBy={mod3d.likedBy} />
        </div>
        <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
          <p>{displayDate}</p>
        </div>
      </div>
    </div>
  );
}
