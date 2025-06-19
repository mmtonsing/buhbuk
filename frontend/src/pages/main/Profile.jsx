import { ModCard } from "../../components/mod3d/Mod3dCard";
import { useState, useEffect } from "react";
import { getCurrentUser, getUserPosts } from "../../api/users";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sortByDateCreated } from "../../utils/sortByDate";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [mod3ds, setMod3ds] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        setUser(currentUser);
        const data = await getUserPosts(currentUser.id);
        const sortedPosts = sortByDateCreated(data);
        setMod3ds(sortedPosts);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const formattedJoinDate = user.joinDate
    ? new Date(user.joinDate).toDateString()
    : "N/A";

  const totalUploads = mod3ds.length;

  //Popularity
  const totalLikes = mod3ds.reduce(
    (acc, mod) => acc + (mod.likedBy?.length || 0),
    0
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 text-stone-200 bg-stone-900 min-h-screen">
      {/* User Info */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-6 rounded-2xl shadow-xl border border-stone-700 mb-10 text-stone-200">
        <h2 className="text-3xl font-bold mb-6 text-stone-100 tracking-wide">
          Your Profile
        </h2>

        <div className="grid sm:grid-cols-3 gap-8 text-sm sm:text-base items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full bg-stone-700 border-4 border-stone-600 overflow-hidden">
              <img
                src={user.avatarUrl || "/avatar.jpg"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="outline"
              className="border-stone-600 text-xs text-stone-300 hover:bg-stone-700 px-3 py-1"
            >
              Change Picture
            </Button>
          </div>

          {/* Info Grid */}
          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-6">
            <div>
              <Label className="block text-stone-400 text-sm mb-1">
                Username
              </Label>
              <p className="text-lg font-medium text-stone-100">
                {user.username}
              </p>
            </div>

            <div>
              <Label className="block text-stone-400 text-sm mb-1">Email</Label>
              <p className="text-lg font-medium text-stone-100">{user.email}</p>
            </div>

            <div>
              <Label className="block text-stone-400 text-sm mb-1">
                Join Date
              </Label>
              <p className="text-lg font-medium text-stone-100">
                {formattedJoinDate}
              </p>
            </div>

            <div className="flex gap-6 items-center mt-2">
              <div className="bg-stone-700 px-4 py-2 rounded-lg text-center">
                <p className="text-sm text-stone-300">Total Posts</p>
                <p className="text-xl font-bold text-amber-400">
                  {mod3ds.length}
                </p>
              </div>
              {/* Popularity */}
              <div className="bg-stone-700 px-4 py-2 rounded-lg text-center">
                <p className="text-sm text-stone-300">Popularity</p>
                <p className="text-xl font-bold text-lime-400">{totalLikes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Buttons */}
        {/* <div className="mt-6 flex gap-4 flex-wrap">
          <Button className="bg-stone-700 hover:bg-stone-600 text-stone-100">
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="border-stone-600 text-stone-300 hover:bg-stone-700"
          >
            Dashboard
          </Button>
        </div> */}
      </div>

      {/* Upload Section Title */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold tracking-wide text-stone-100">
          Your Uploads
        </h3>
        {mod3ds.length > 0 && (
          <Button
            className="bg-[#59322d] hover:bg-[#47211f] text-stone-100 flex items-center gap-2"
            onClick={() => navigate("/upload")}
          >
            <Plus size={18} />
            Post
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
          ))}
        </div>
      ) : mod3ds.length === 0 ? (
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
              onClick={() => navigate("/upload")}
            >
              <Plus size={20} />
              Start Posting
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mod3ds.map((mod3d) => (
            <ModCard key={mod3d._id} mod3d={mod3d} />
          ))}
        </div>
      )}
    </div>
  );
}
