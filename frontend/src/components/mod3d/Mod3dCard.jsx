import { Link } from "react-router-dom";
import LikeHandler from "@/context/LikeHandler";
import { UserBadge } from "@/components/user/UserBadge";
import { timeAgo } from "@/utils/timeAgo";
import { SmallText } from "@/components/customUI/Typography";

export function ModCard({ post }) {
  const displayDate = timeAgo(post?.createdAt);

  return (
    <div className="block rounded-xl border border-stone-700 shadow bg-stone-800 hover:bg-stone-700 text-stone-100 overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300 group">
      <Link to={`/viewmod3d/${post.refId._id}`}>
        <div className="flex justify-center items-center bg-stone-900 h-52">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-contain h-full w-full rounded-md p-2"
              loading="lazy"
            />
          ) : (
            <p className="text-sm text-stone-500">No Image</p>
          )}
        </div>

        <div className="p-4 space-y-1">
          <h3 className="text-base font-semibold text-stone-100 line-clamp-1">
            {post.refId.title}
          </h3>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between pt-1 text-xs text-muted">
          {post.author && (
            <UserBadge user={post.author} key={post.author._id} />
          )}
          <LikeHandler postId={post._id} likedBy={post.likedBy} />
        </div>
        <div className="flex items-center justify-between pt-1 text-xs text-muted">
          <SmallText>{displayDate}</SmallText>
        </div>
      </div>
    </div>
  );
}
