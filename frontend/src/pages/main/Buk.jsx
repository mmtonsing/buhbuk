import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicPosts } from "@/api/postsApi";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { PostCard } from "@/components/posts/PostCard";
import {
  PageTitle,
  PageSubtitle,
  PageParagraph,
  SectionTitle,
} from "@/components/customUI/Typography";

export function Buk() {
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
      {/* Hero Banner */}
      <section className="relative w-full h-[85vh] sm:h-[80vh] md:h-[90vh] lg:h-[93vh] text-white overflow-hidden">
        <img
          src="/homebackground.JPG"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="max-w-3xl text-center">
            <PageTitle className="mb-4 lg:!text-6xl">
              Welcome to BuhBuk
            </PageTitle>
            <PageParagraph>
              BuhBuk is our granary of creativity. Whether you create, explore,
              or support
            </PageParagraph>
            <PageParagraph className="mb-4">— you belong here —</PageParagraph>
            <PageSubtitle>
              Where every story, sketch, and spark finds a home.
            </PageSubtitle>
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="py-16 bg-stone-800 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle className="mb-0">Trending Harvests</SectionTitle>

          {loading ? (
            <SkeletonGrid />
          ) : trendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trendingPosts.map((post) => (
                <PostCard key={post._id} post={post}>
                  {post.category === "Blog" && (
                    <p className="text-sm text-stone-300 line-clamp-2 mt-2">
                      {post.refId?.summary}
                    </p>
                  )}
                </PostCard>
              ))}
            </div>
          ) : (
            <PageParagraph>No recent posts yet.</PageParagraph>
          )}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/harvests")}
              className="btn-buhbuk px-4 py-2 rounded-lg"
            >
              View More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
