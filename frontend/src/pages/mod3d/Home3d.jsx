import { useState, useEffect } from "react";
import { getPublicPosts } from "@/api/postsApi";
import { ModCard } from "@/components/mod3d/Mod3dCard";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { Button } from "@/components/ui/button";

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
    loadMod3ds(1, true); // initial load or sort change
  }, [sort]);

  async function loadMod3ds(pageToLoad = 1, reset = false) {
    setLoading(true);
    try {
      const posts = await getPublicPosts({
        category: "Mod3d",
        sort,
        page: pageToLoad,
        limit: 12,
      });
      if (reset) {
        setMod3ds(posts);
      } else {
        setMod3ds((prev) => [...prev, ...posts]);
      }
      setHasMore(posts.length === 8);
      setPage(pageToLoad);
    } catch (err) {
      console.error("Failed to load models:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => loadMod3ds(page + 1);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-stone-100">All 3D Models</h2>
        <div className="mb-6 flex justify-end gap-4">
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
      </div>

      {loading && mod3ds.length === 0 ? (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
          ))}
        </div>
      ) : mod3ds.length === 0 ? (
        <div className="text-center text-lg text-stone-300 py-20">
          No models available.
        </div>
      ) : (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {mod3ds.map((post) => (
            <ModCard key={post._id} post={post} />
          ))}
        </div>
      )}

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
