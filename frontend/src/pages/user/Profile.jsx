import { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMyPosts } from "@/api/postsApi";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProfilePicUploader from "@/components/user/ProfilePicUploader";
import { EditProfileForm } from "@/components/user/EditProfileForm";
import { SuccessModal } from "@/components/customUI/SuccessModal";
import { EmailVerifyModal } from "@/components/customUI/EmailVerifyModal";
import { CategoryFilter } from "@/components/general/CategoryFilter";
import { CATEGORY_LABELS } from "@/utils/constants";
import { sortByDateCreated } from "@/utils/sortByDate";

export function Profile() {
  const { user, setUser, loading, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserPosts() {
      if (!user?.id) return;
      try {
        const data = await getMyPosts();
        console.log("Updated posts after profile pic change:", data.posts);
        setPosts(sortByDateCreated(data.posts));
      } catch (err) {
        console.error("Failed to load user posts:", err);
      }
    }
    loadUserPosts();
  }, [user?.id]);

  if (loading || !user) {
    return <div className="text-center p-10">Loading user...</div>;
  }

  const formattedJoinDate = new Date(user.createdAt).toDateString();
  const totalLikes = posts.reduce(
    (acc, post) => acc + (post.likedBy?.length || 0),
    0
  );

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="w-screen max-w-7xl mx-auto px-4 py-10 text-stone-200 bg-stone-900 min-h-screen">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-6 rounded-2xl shadow-xl border border-stone-700 mb-10">
        <h2 className="text-3xl font-bold mb-6 text-stone-100 tracking-wide">
          Your Profile
        </h2>

        <div className="grid sm:grid-cols-3 gap-8 items-start">
          {/* Avatar & Edit Info */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <ProfilePicUploader
              currentPic={user.profilePic}
              onUploadSuccess={async () => {
                try {
                  await refreshUser();
                  const { posts: updatedPosts } = await getMyPosts();
                  setPosts(sortByDateCreated(updatedPosts));
                } catch (err) {
                  console.error(
                    "Failed to update after profile picture change:",
                    err
                  );
                }
              }}
            />

            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white w-full sm:w-fit text-sm sm:text-base px-3 py-2"
            >
              <Edit size={16} className="mr-2" />
              Edit Info
            </Button>

            <div>
              <Label className="block text-stone-400 text-sm mb-1">
                Join Date
              </Label>
              <p className="text-base font-medium text-stone-100">
                {formattedJoinDate}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-6">
            <div>
              <Label className="block text-stone-400 text-sm mb-1">
                Username
              </Label>
              <p className="text-lg font-medium text-stone-100">
                {user.username}
              </p>
            </div>

            <div className="sm:col-span-2">
              <Label className="block text-stone-400 text-sm mb-1">Email</Label>
              <div className="flex flex-wrap gap-2 items-center text-sm sm:text-base text-stone-100 break-all">
                <span className="truncate">{user.email}</span>
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
            </div>

            <div className="flex gap-6 items-center mt-2">
              <div className="bg-stone-700 px-4 py-2 rounded-lg text-center">
                <p className="text-sm text-stone-300">Total Posts</p>
                <p className="text-xl font-bold text-amber-400">
                  {posts.length}
                </p>
              </div>
              <div className="bg-stone-700 px-4 py-2 rounded-lg text-center">
                <p className="text-sm text-stone-300">Popularity</p>
                <p className="text-xl font-bold text-lime-400">{totalLikes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-stone-100 mb-4">
              Edit Your Info
            </h3>

            {/* Edit User Profile */}
            <EditProfileForm
              user={user}
              onSuccess={async (form) => {
                await refreshUser();
                const { posts: updatedPosts } = await getMyPosts();
                setPosts(sortByDateCreated(updatedPosts));
                setShowEditForm(false);
                setShowSuccessModal(true); // ✅ trigger first

                // Show email verify modal AFTER 1s delay
                if (form.email && form.email !== user.email) {
                  setTimeout(() => {
                    setShowVerifyEmailModal(true); // ✅ trigger second
                  }, 1000);
                }
              }}
              onSubmit={() => setShowEditForm(false)} // closes modal
              onCancel={() => setShowEditForm(false)} // ✅ this will now handle Cancel
            />
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold tracking-wide text-stone-100">
          Your Uploads
        </h3>
        {posts.length > 0 && (
          <Button
            className="bg-[#59322d] hover:bg-[#47211f] text-stone-100 flex items-center gap-2"
            onClick={() => navigate("/upload")}
          >
            <Plus size={18} />
            Post
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selected={selectedCategory}
        onChange={setSelectedCategory}
        categories={categories}
      />

      {/* Upload Grid */}
      {posts.length === 0 ? (
        <div className="bg-stone-800 border border-stone-700 rounded-xl p-8 shadow-md text-center text-stone-300">
          <h3 className="text-xl font-semibold text-stone-100 mb-2">
            You haven’t posted anything yet.
          </h3>
          <p className="mb-4">
            Share your 3D models, blog entries, or creative stories!
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-[#59322d] hover:bg-[#47211f] text-stone-100 px-6 py-2 text-lg flex items-center gap-2"
              onClick={() => navigate("/post")}
            >
              <Plus size={20} />
              Start Posting
            </Button>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
      <SuccessModal isOpen={showSuccessModal} setIsOpen={setShowSuccessModal} />
      <EmailVerifyModal
        isOpen={showVerifyEmailModal}
        setIsOpen={setShowVerifyEmailModal}
      />
    </div>
  );
}
