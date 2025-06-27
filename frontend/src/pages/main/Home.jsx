import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logoutHandler";
import { useAuth } from "../../context/AuthContext";
import { Suspense, lazy } from "react";
import { SkeletonCard } from "../../components/customUI/SkeletonCard";
import { HomeSidebarNav } from "@/components/navbar/HomeSidebarNav";
import { useState, useEffect } from "react";
import { getLatestPosts } from "@/api/posts";
import { PostCard } from "@/components/posts/PostCard";

const Latest3dPreview = lazy(() =>
  import("../../components/mod3d/Latest3dPreview")
);
const BlogSection = lazy(() => import("../../components/blog/BlogSection"));

export function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [latestPosts, setLatestPosts] = useState([]);

  const onLogout = () => handleLogout(navigate, setUser);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const posts = await getLatestPosts();
        setLatestPosts(posts.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch latest posts", err);
      }
    }

    fetchLatestPosts();
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

  const handleViewAll = () => navigate("/home3d");

  return (
    <div className="flex flex-col min-h-screen w-screen bg-stone-900 text-stone-200">
      <HomeSidebarNav />

      {/* Hero Banner */}
      <section
        id="welcome"
        className="scroll-mt-20 bg-gradient-to-r from-[#4b2e2b] to-[#6b4226] text-stone-100 py-20"
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Welcome to BukWarm
          </h1>
          <p className="text-xl mb-4">
            Upload your work, share stories, and showcase your talents in our
            cozy cabin.
          </p>
          <h2 className="text-lg mb-8 italic text-amber-200">
            Where creativity warms the soul.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Button
                variant="destructive"
                className="bg-[#59322d] hover:bg-red-600 text-stone-100 px-6 py-2 text-lg rounded-lg"
                onClick={onLogout}
              >
                Log Out
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-[#59322d] hover:bg-[#47211f] text-stone-100 px-6 py-2 text-lg rounded-lg shadow-md"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 🔥 Latest Posts Section */}
      <section className="py-16 bg-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-300">Latest Posts</h2>
            <Button
              onClick={() => navigate("/feed")}
              className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg"
            >
              View More
            </Button>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {latestPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-stone-400 text-center">No recent posts yet.</p>
          )}
        </div>
      </section>

      {/* Latest 3D Models */}
      <section
        id="3d"
        className="min-h-screen scroll-mt-20 py-16 bg-stone-800 flex-1"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold mb-6 text-amber-300">
              Latest 3D Models
            </h2>
            <div className="mt-8 text-center">
              <Button
                onClick={handleViewAll}
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base lg:px-8 lg:py-3 lg:text-lg bg-[#5c3a2d] hover:bg-[#44251f] text-stone-100 rounded-lg transition-all"
              >
                View More
              </Button>
            </div>
          </div>

          <Suspense fallback={<SkeletonGrid />}>
            <Latest3dPreview />
          </Suspense>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blogs" className="scroll-mt-20 py-16 bg-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-amber-300">
            Latest Articles
          </h2>
          <Suspense fallback={<SkeletonGrid />}>
            <BlogSection />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-16 bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Secure Storage",
              icon: "🔒",
              desc: "Your files rest safely in our amber‑lit vault.",
            },
            {
              title: "Easy Upload",
              icon: "⬆️",
              desc: "Feels like setting logs on the hearth—just drag & drop.",
            },
            {
              title: "Community",
              icon: "👥",
              desc: "Gather ’round the firelight with fellow creators.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="bg-stone-800 rounded-xl p-6 shadow-md hover:shadow-amber-100/10 transition"
            >
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-stone-100">
                {feat.title}
              </h3>
              <p className="text-stone-300">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} BukWarm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
