import { useEffect, useState } from "react";
import { getFeedPosts } from "@/api/posts";
import { PostCard } from "@/components/PostCard";
import Loader from "@/components/customUI/Loader";
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { posts, totalPages } = await getFeedPosts(page);
        setPosts(posts);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("❌ Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-28">
      {" "}
      {/* 👈 pb-28 for bottom navbar space */}
      <h1 className="text-2xl font-bold text-white mb-6">🌍 Feed</h1>
      {loading ? (
        <Loader message="Loading Feeds" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <div className="fixed bottom-16 inset-x-0 flex justify-center gap-3 z-20 sm:static sm:mt-8">
            {/* 👆 Mobile: stick above bottom nav; Desktop: static position */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-stone-700 text-white rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-stone-300 py-2">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-stone-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
