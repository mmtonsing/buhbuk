import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicMod3ds } from "../../api/mod3ds";
import { PublicCard } from "../general/PublicCard";
import { SkeletonCard } from "../customUI/SkeletonCard";
import { Button } from "@/components/ui/button";

export default function Latest3dPreview() {
  const navigate = useNavigate();
  const [mod3ds, setMod3ds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMods() {
      try {
        const data = await getPublicMod3ds();
        setMod3ds(data);
      } catch (err) {
        console.error("Failed to load 3D models:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMods();
  }, []);

  return (
    <>
      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} className="bg-stone-700 animate-pulse" />
            ))}
          </div>
        ) : mod3ds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* diplay latest 6 */}
            {mod3ds.slice(0, 6).map((mod3d) => (
              <Link
                to={`/viewmod3d/${mod3d._id}`}
                className="transition-transform hover:scale-105 hover:shadow-xl duration-300"
                key={mod3d._id}
              >
                <PublicCard mod3d={mod3d} key={mod3d._id} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-stone-400">
            No 3D models found or failed to load.
          </p>
        )}
      </div>
    </>
  );
}
