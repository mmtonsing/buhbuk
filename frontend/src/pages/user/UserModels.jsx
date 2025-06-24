import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMod3ds } from "../../api/mod3ds";
import { ModCard } from "../../components/mod3d/Mod3dCard";
import { SkeletonCard } from "../../components/customUI/SkeletonCard";

export function UserModels() {
  const [userModels, setUserModels] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const all = await getMod3ds();
        const filtered = all.filter((mod) => mod.author?._id === id);
        setUserModels(filtered);

        if (filtered.length > 0 && filtered[0].author) {
          setUser(filtered[0].author);
        }
      } catch (err) {
        console.error("Failed to load user models", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const totalLikes = userModels.reduce(
    (acc, mod) => acc + (mod.likedBy?.length || 0),
    0
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 text-stone-200 bg-stone-900 min-h-screen">
      {/* User Info */}
      {user && (
        <div className="bg-stone-800 p-6 rounded-2xl shadow-xl border border-stone-700 mb-10">
          <h2 className="text-3xl font-bold mb-6 text-stone-100 tracking-wide">
            {user.username}'s Profile
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-600">
              <img
                src={
                  user.profilePic
                    ? `/api/file/raw/${encodeURIComponent(user.profilePic)}`
                    : "/avatar.jpg"
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="sm:col-span-2 grid sm:grid-cols-2 gap-6 text-sm sm:text-base">
              <div>
                <p className="text-stone-400 text-sm mb-1">Username</p>
                <p className="text-lg font-medium text-stone-100">
                  {user.username}
                </p>
              </div>
              <div>
                <p className="text-stone-400 text-sm mb-1">Email</p>
                <p className="text-lg font-medium text-stone-100">
                  {user.email || "Hidden"}
                </p>
              </div>
              <div className="bg-stone-700 px-4 py-2 rounded-lg text-center col-span-2 sm:col-span-1">
                <p className="text-sm text-stone-300">Total Posts</p>
                <p className="text-xl font-bold text-amber-400">
                  {userModels.length}
                </p>
              </div>
              <div className="bg-stone-700 px-4 py-2 rounded-lg text-center col-span-2 sm:col-span-1">
                <p className="text-sm text-stone-300">Popularity</p>
                <p className="text-xl font-bold text-lime-400">{totalLikes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <h3 className="text-2xl font-semibold tracking-wide text-stone-100 mb-6">
        Uploads by {user?.username || "user"}
      </h3>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : userModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userModels.map((mod) => (
            <ModCard key={mod._id} mod3d={mod} />
          ))}
        </div>
      ) : (
        <p className="text-stone-400">No models found.</p>
      )}
    </div>
  );
}
