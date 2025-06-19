import { Link } from "react-router-dom";
import { UserBadge } from "@/pages/user/UserBadge";
import LikeWithAuth from "@/context/LikeWithAuth";

export function ModCard({ mod3d }) {
  const date = new Date(mod3d.dateCreated);
  const stringDate = mod3d?.dateCreated
    ? date.toString().slice(4, 15)
    : "Unknown Date";

  return (
    <div className="block rounded-xl border border-stone-700 shadow bg-stone-800 hover:bg-stone-700 text-stone-100 overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300 group">
      <Link to={`/viewmod3d/${mod3d._id}`}>
        <div className="flex justify-center items-center bg-stone-900 h-52">
          {mod3d.image ? (
            <img
              src={mod3d.image}
              alt={mod3d.title}
              className="object-contain h-full w-full rounded-md p-2"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-500 text-center">No Image</div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-1">
        <Link to={`/viewmod3d/${mod3d._id}`}>
          <h3 className="text-base font-semibold line-clamp-1">
            {mod3d.title}
          </h3>
        </Link>

        {mod3d.author && <UserBadge user={mod3d.author} className="mt-1" />}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-stone-500">{stringDate}</p>

          <LikeWithAuth modId={mod3d._id} likedBy={mod3d.likedBy} />
        </div>
      </div>
    </div>
  );
}
