import { getPublicPosts } from "@/api/postsApi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "../../components/customUI/SkeletonCard";
import { PostCard } from "@/components/posts/PostCard";

export function Home() {
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        const trendingPosts = await getPublicPosts({
          sort: "trending",
          limit: 6,
        });
        setTrendingPosts(trendingPosts);
      } catch (err) {
        console.error("Failed to fetch latest posts", err);
      }
    }

    fetchTrendingPosts();
  }, []);

  const SkeletonGrid = () => (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-screen bg-stone-900 text-stone-200">
      {/* Hero Banner */}
      <section
        id="welcome"
        className="scroll-mt-20 bg-gradient-to-r from-[#4b2e2b] to-[#6b4226] text-stone-100 py-20"
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Welcome to EimiBuk
          </h1>
          <p className="text-xl mb-4">
            Upload your work, share stories, and showcase your talents in our
            cozy cabin.
          </p>
          <h2 className="text-lg mb-8 italic text-amber-200">
            Where creativity warms the soul.
          </h2>
        </div>
      </section>

      {/* 🔥 Trending Posts Section */}
      <section className="py-16 bg-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-300">
              Trending Posts
            </h2>
            <Button
              onClick={() => navigate("/feed")}
              className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg"
            >
              Explore More
            </Button>
          </div>
          {trendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trendingPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-stone-400 text-center">No recent posts yet.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} EimiBuk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
