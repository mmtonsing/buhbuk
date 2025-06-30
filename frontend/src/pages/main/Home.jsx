import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicPosts } from "@/api/postsApi";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { PostCard } from "@/components/posts/PostCard";

export function Home() {
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        const posts = await getPublicPosts({
          sort: "trending",
          limit: 9,
        });
        setTrendingPosts(posts);
      } catch (err) {
        console.error("Failed to fetch trending posts", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingPosts();
  }, []);

  const SkeletonGrid = () => (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-screen bg-stone-900 text-stone-200">
      {/* HomeBanner */}
      <section className="relative w-full h-[85vh] sm:h-[80vh] md:h-[90vh] lg:h-[93vh] text-white overflow-hidden">
        {/* Full Image */}
        <img
          src="/homebackground.JPG"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Foreground content */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="max-w-3xl text-center">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Welcome to BuhBuk
            </h1>
            <p className="text-xl mb-4">
              BuhBuk is our granary of creativity. Whether you create, explore,
              or support
            </p>
            <p className="text-xl mb-4">— you belong here —</p>
            <h2 className="text-lg mb-8 italic text-amber-200">
              Where every story, sketch, and spark finds a home.
            </h2>
          </div>
        </div>
      </section>

      {/* <section
        id="welcome"
        className="scroll-mt-20 bg-gradient-to-r from-[#4b2e2b] to-[#6b4226] text-stone-100 py-20"
        style={{
          backgroundImage: `url('/homebackground.jpg')`,
        }}
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Welcome to BuhBuk
          </h1>
          <p className="text-xl mb-4">
            BuhBuk is our granary of creativity. Whether you create, explore, or
            support
          </p>
          <p className="text-xl mb-4">— you belong here —</p>
          <h2 className="text-lg mb-8 italic text-amber-200">
            Where every story, sketch, and spark finds a home.
          </h2>
        </div>
      </section> */}

      {/* 🔥 Trending Posts */}
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
              View More
            </Button>
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : trendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trendingPosts.map((post) => (
                <PostCard key={post._id} post={post}>
                  {/* Optional: Add content here if specific to the type */}
                  {post.category === "Blog" && (
                    <p className="text-sm text-stone-300 line-clamp-2 mt-2">
                      {post.refId?.summary}
                    </p>
                  )}
                </PostCard>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 text-center">No recent posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
