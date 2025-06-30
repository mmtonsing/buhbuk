//src/components/posts/PostCard.jsx
import { Link } from "react-router-dom";
import { UserBadge } from "@/components/user/UserBadge";
import LikeHandler from "@/context/LikeHandler";
import { timeAgo } from "@/utils/timeAgo";

export function PostCard({ post, children }) {
  if (!post || !post.refId || typeof post.refId !== "object") {
    console.warn("⚠️ Skipping PostCard render due to missing refId:", post);
    return null;
  }

  const displayDate = timeAgo(post.createdAt || post.refId.dateCreated);
  const imageUrl = post.refId.imageUrl;
  const title = post.refId.title || "Untitled";
  const category = post.category;

  const getViewRoute = () => {
    switch (category) {
      case "Mod3d":
        return `/viewmod3d/${post.refId._id}`;
      case "Graphic":
        return `/graphics/${post.refId._id}`;
      case "Blog":
        return `/blogs/${post.refId._id}`;
      default:
        return `/viewpost/${post._id}`;
    }
  };

  return (
    <div className="rounded-xl border border-stone-700 shadow bg-stone-800 hover:bg-stone-700 overflow-hidden transition-transform hover:scale-105 duration-300">
      <Link to={getViewRoute()}>
        <div className="bg-stone-900 h-52 flex justify-center items-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="object-contain h-full w-full p-2"
              loading="lazy"
            />
          ) : (
            <p className="text-stone-400">No Image</p>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold line-clamp-1 mb-2">{title}</h3>

          {/* Optional extra content */}
          {children}

          <div className="flex items-center justify-between text-xs text-stone-400 pt-2">
            {post.author && <UserBadge user={post.author} />}
            <LikeHandler postId={post._id} likedBy={post.likedBy} />
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>{displayDate}</span>
            <span className="text-amber-400 font-medium">{category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
