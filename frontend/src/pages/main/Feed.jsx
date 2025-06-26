import { useEffect, useState } from "react";
import { getLatestPosts } from "@/api/posts";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const posts = await getLatestPosts();
        setPosts(posts.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch latest posts", err);
      }
    }

    fetchLatestPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : posts.map((post) => <PostCard key={post._id} post={post} />)}
    </div>
  );
}
