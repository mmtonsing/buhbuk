import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonCard } from "../../components/customUI/SkeletonCard";
import { getUserPosts } from "../../api/posts";
import { CATEGORY_LABELS } from "@/utils/constants";
import { CategoryFilter } from "@/components/general/CategoryFilter";
import { Label } from "@/components/ui/label";

export function UserPosts() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await getUserPosts(id);
        setPosts(data.posts);

        if (data.posts.length > 0 && data.posts[0].author) {
          setUser(data.posts[0].author);
        }
      } catch (err) {
        console.error("❌ Failed to load user posts", err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [id]);

  const totalLikes = posts.reduce(
    (acc, post) => acc + (post.refId?.likedBy?.length || 0),
    0
  );

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 text-stone-200 bg-stone-900 min-h-screen">
      {/* User Info */}
      {user && (
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-6 rounded-2xl shadow-xl border border-stone-700 mb-10">
          <h2 className="text-3xl font-bold mb-6 text-stone-100 tracking-wide">
            {user.username}'s Profile
          </h2>

          <div className="grid sm:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="relative w-45 h-80 mt-3 gap-2">
                <div className="absolute top-0 right-0 pr-5 rounded-full text-white shadow-md">
                  {user.emailVerified ? (
                    <span className="text-lime-400 whitespace-nowrap">
                      ✔ Verified
                    </span>
                  ) : (
                    <span className="text-red-400 whitespace-nowrap">
                      ✖ Not Verified
                    </span>
                  )}
                </div>
                <div className="relative w-24 h-24">
                  <img
                    src={user.profilePicUrl || "/avatar.jpg"}
                    alt="User avatar"
                    className="w-full h-full aspect-square rounded-full object-center object-cover border border-stone-700"
                  />{" "}
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="sm:col-span-2 grid sm:grid-cols-2 gap-6 text-sm sm:text-base">
              <div>
                <Label className="block text-stone-400 text-sm mb-1">
                  Username
                </Label>
                <p className="text-lg font-medium text-stone-100">
                  {user.username}
                </p>
              </div>

              <div className="sm:col-span-2">
                <Label className="block text-stone-400 text-sm mb-1">
                  Email
                </Label>
                <div className="flex flex-wrap gap-2 items-center text-sm sm:text-base text-stone-100 break-all">
                  <span className="truncate">{user.email || "Hidden"}</span>
                </div>
              </div>

              <div className="flex gap-6 items-center mt-2">
                <div className="bg-stone-700 px-4 py-2 rounded-lg text-center">
                  <p className="text-sm text-stone-300">Total Posts</p>
                  <p className="text-xl font-bold text-amber-400">
                    {posts.length}
                  </p>
                </div>
                <div className="bg-stone-700 px-4 py-2 rounded-lg text-center col-span-2 sm:col-span-1">
                  <p className="text-sm text-stone-300">Popularity</p>
                  <p className="text-xl font-bold text-lime-400">
                    {totalLikes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <CategoryFilter
        selected={selectedCategory}
        onChange={setSelectedCategory}
        categories={categories}
      />

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-stone-400">No posts found in this category.</p>
      )}
    </div>
  );
}
