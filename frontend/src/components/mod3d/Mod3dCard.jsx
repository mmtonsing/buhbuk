import { Link } from "react-router-dom";
import LikeHandler from "@/context/LikeHandler";
import { UserBadge } from "@/components/user/UserBadge";
import { timeAgo } from "@/utils/timeAgo";
import { SmallText } from "@/components/customUI/Typography";
import { formatCategory } from "@/utils/formatCategory";

export function ModCard({ post }) {
  const displayDate = timeAgo(post?.createdAt);
  const category = post.category;

  return (
    <div className="rounded-xl border border-stone-700 shadow bg-stone-800 hover:bg-stone-700 overflow-hidden transition-transform hover:scale-105 duration-300 group">
      <Link to={`/viewmod3d/${post.refId._id}`}>
        <div className="bg-stone-900 h-52 w-full flex justify-center items-center overflow-hidden">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.refId.title}
              className="object-contain max-h-full w-full p-2"
              loading="lazy"
            />
          ) : (
            <p className="text-stone-400 text-sm">No Image</p>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-stone-100 line-clamp-1">
            {post.refId.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted pt-2">
            {post.author && <UserBadge user={post.author} />}
            <LikeHandler postId={post._id} likedBy={post.likedBy} />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <SmallText>{displayDate}</SmallText>
            <span className="text-[color:var(--color-buhbukAccent)] font-medium">
              {formatCategory(category)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
