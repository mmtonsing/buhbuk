import { getPublicMod3ds } from "../../api/mod3ds";
import { useState, useEffect } from "react";
import { ModCard } from "../../components/mod3d/Mod3dCard";
import { sortByDateCreated } from "../../utils/sortByDate";
import { SkeletonCard } from "@/components/customUI/SkeletonCard";

export function Home3d() {
  const [mod3ds, setMod3ds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMod3ds() {
      try {
        const data = await getPublicMod3ds();
        const sorted = sortByDateCreated(data);
        setMod3ds(sorted);
      } catch (err) {
        console.error("Failed to load models:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMod3ds();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (mod3ds.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center text-lg text-stone-300">
        No models available.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-stone-100 text-center">
        All 3D Models
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mod3ds.map((mod3d) => (
          <ModCard key={mod3d._id} mod3d={mod3d} />
        ))}
      </div>
    </div>
  );
}
