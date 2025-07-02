import { useState, useEffect } from "react";
import { getPublicPosts } from "@/api/postsApi";
import { ModCard } from "@/components/mod3d/Mod3dCard";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { PageTitle } from "@/components/customUI/Typography";

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
];

export function Home3d() {
  const [mod3ds, setMod3ds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("trending");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadMod3ds(1, true);
  }, [sort]);

  async function loadMod3ds(pageToLoad = 1, reset = false) {
    setLoading(true);
    try {
      const posts = await getPublicPosts({
        category: "Mod3d",
        sort,
        limit: 12,
        page: pageToLoad,
      });
      if (reset) {
        setMod3ds(posts);
      } else {
        setMod3ds((prev) => [...prev, ...posts]);
      }
      setHasMore(posts.length === 12);
      setPage(pageToLoad);
    } catch (err) {
      console.error("Failed to load models:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => loadMod3ds(page + 1);

  return (
    <div className="flex flex-col flex-1 min-h-screen w-full max-w-7xl mx-auto px-4 py-10">
      {/* Heading and sort filter */}
      <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
        <PageTitle className="text-left">All 3D Models</PageTitle>
        <select
          className="bg-stone-800 text-stone-100 border border-stone-600 rounded px-3 py-1"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && mod3ds.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
            ))
          : mod3ds.map((post) => <ModCard key={post._id} post={post} />)}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="btn-buhbuk px-6 py-2 rounded-xl"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
