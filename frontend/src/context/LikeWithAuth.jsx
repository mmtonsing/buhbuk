import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LikeButton } from "../components/general/LikeButton";

export default function LikeWithAuth({ modId, likedBy = [] }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const currentUserId = user?.id;
  const likeCount = likedBy.length;

  const isLiked = currentUserId
    ? likedBy.some((id) => id?.toString?.() === currentUserId)
    : false;

  const handleRedirect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/auth", {
      state: { message: "You must be logged in to continue." },
    });
  };

  if (loading) {
    return (
      <div className="text-sm text-stone-400 flex items-center gap-1">
        ♡ {likeCount}
      </div>
    );
  }

  return (
    <LikeButton
      modId={modId}
      userId={currentUserId}
      initialLiked={isLiked}
      initialCount={likeCount}
      onUnauthenticatedClick={handleRedirect}
    />
  );
}
