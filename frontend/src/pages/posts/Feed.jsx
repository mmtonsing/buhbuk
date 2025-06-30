import { useEffect, useState } from "react";
import { getPublicPosts } from "@/api/postsApi";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("trending");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts(1, true); // initial load or sort change
  }, [sort]);

  async function loadPosts(pageToLoad = 1, reset = false) {
    setLoading(true);
    try {
      const newPosts = await getPublicPosts({
        sort,
        limit: 8,
        page: pageToLoad,
      });
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(newPosts.length === 8);
      setPage(pageToLoad);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => loadPosts(page + 1);

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 py-10">
      {/* 🌾 BuhBuk Feed Intro */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-amber-300 mb-2">
          The BuhBuk Feed
        </h1>
        <p className="text-lg text-stone-300 max-w-2xl mx-auto">
          Fresh from the barn: explore trending creations, heartfelt stories,
          and digital harvests from our vibrant community. Welcome to the
          granary of ideas.
        </p>
      </div>

      {/* 🔽 Sort Options */}
      <div className="mb-6 flex justify-end gap-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-stone-800 text-stone-200 border border-stone-600 px-4 py-2 rounded"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🧱 Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && posts.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
            ))
          : posts.map((post) => (
              <PostCard key={post._id} post={post}>
                {post.category === "Blog" && (
                  <p className="text-sm text-stone-300 line-clamp-2 mt-2">
                    {post.refId?.summary}
                  </p>
                )}
              </PostCard>
            ))}
      </div>

      {/* ⏬ Load More */}
      {hasMore && (
        <div className="mt-10 text-center">
          <Button
            onClick={handleLoadMore}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
