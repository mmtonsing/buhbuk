import { Heart } from "lucide-react";
import { useState } from "react";
import { togglePostLike } from "@/api/postsApi"; // ✅ correct API
import { useNavigate } from "react-router-dom";

export function LikeButton({
  postId,
  userId,
  initialLiked = false,
  initialCount = 0,
  onToggle,
  onUnauthenticatedClick, // optional override
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      if (onUnauthenticatedClick) {
        onUnauthenticatedClick(e);
      } else {
        navigate("/auth", {
          state: { message: "You must be logged in to like a post." },
        });
      }
      return;
    }

    if (loading) return;
    setLoading(true);

    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setLikeCount((prev) => prev + (optimisticLiked ? 1 : -1));

    try {
      const { data } = await togglePostLike(postId);
      setLiked(data.liked);
      setLikeCount(data.count);
      onToggle?.(data);
    } catch (err) {
      console.error("❌ Like failed:", err);
      // rollback
      setLiked(!optimisticLiked);
      setLikeCount((prev) => prev + (optimisticLiked ? -1 : 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1 text-sm text-stone-300 hover:text-pink-500 transition"
    >
      <Heart
        className={`w-5 h-5 ${liked ? "fill-pink-500 text-pink-500" : ""}`}
      />
      <span>{likeCount}</span>
    </button>
  );
}
