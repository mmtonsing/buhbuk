import { Link } from "react-router-dom";
import { UserBadge } from "@/pages/user/UserBadge";
import LikeWithAuth from "@/context/LikeWithAuth";
import { timeAgo } from "@/utils/timeAgo";

export function PostCard({ post }) {
  if (!post) return null;

  const { _id, category, author, refId, createdAt } = post;

  // ✅ If refId is missing or the populated object is not found
  if (!refId || typeof refId !== "object") {
    console.warn("⚠️ Skipping PostCard render, refId is missing:", post);
    return null; // or show a fallback
  }

  const imageSrc = refId.imageUrl || null;
  const postDate = createdAt || refId.dateCreated;
  const postTitle = refId.title || "Untitled";
  const displayCategory = category === "Mod3d" ? "3D Model" : category;

  const getViewRoute = () => {
    switch (category) {
      case "Mod3d":
        return `/viewmod3d/${refId._id}`;
      case "Graphic":
        return `/graphics/${refId._id}`;
      case "Blog":
        return `/blogs/${refId._id}`;
      default:
        return `/viewpost/${_id}`;
    }
  };

  return (
    <div className="block rounded-xl border border-stone-700 shadow bg-stone-800 hover:bg-stone-700 text-stone-100 overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300 group">
      <Link to={getViewRoute()}>
        <div className="flex justify-center items-center bg-stone-900 h-52">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Post preview"
              className="object-contain h-full w-full rounded-md p-2"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-500 text-center">No Image</div>
          )}
        </div>

        <div className="p-4 space-y-1">
          <h3 className="text-base font-semibold line-clamp-1">{postTitle}</h3>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
          {author && <UserBadge user={author} />}
          {refId._id && <LikeWithAuth postId={_id} likedBy={post.likedBy} />}
        </div>

        <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
          <span>{timeAgo(postDate)}</span>
          <span className="text-amber-400 font-semibold">
            {displayCategory}
          </span>
        </div>
      </div>
    </div>
  );
}
