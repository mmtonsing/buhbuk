import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleLikeAPI } from "../../api/likes";
import { useNavigate } from "react-router-dom"; // ✅ Needed to redirect

export function LikeButton({
  modId,
  userId,
  initialLiked = false,
  initialCount = 0,
  onToggle,
  onUnauthenticatedClick,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // No user? Redirect to login
    //If not logged in, redirect with banner message
    if (!userId) {
      navigate("/auth", {
        state: { message: "You must be logged in to like a post." },
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));

    try {
      await toggleLikeAPI(modId, userId);
      onToggle?.(newLiked);
    } catch (err) {
      // rollback
      setLiked(!newLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      console.error("Like failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
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
