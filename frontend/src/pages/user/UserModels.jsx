import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMod3ds } from "../../api/mod3ds";
import { ModCard } from "../../components/mod3d/Mod3dCard";
import { SkeletonCard } from "../../components/customUI/SkeletonCard"; // adjust path if needed

export function UserModels() {
  const [userModels, setUserModels] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await getMod3ds();
      const filtered = all.filter((mod) => mod.author?._id === id);
      setUserModels(filtered);
      if (filtered.length > 0 && filtered[0].author?.username) {
        setUsername(filtered[0].author.username);
      }
      setLoading(false);
    }
    load();
  }, [id]);
  //
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-100 mb-6">
        All models by{" "}
        <span className="text-blue-400">{username || "user"}</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : userModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
