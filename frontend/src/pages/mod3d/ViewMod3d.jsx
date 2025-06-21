import { getMod3d, deleteMod3d } from "../../api/mod3ds";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserBadge } from "../user/UserBadge";
import { ConfirmModal } from "@/components/customUI/ConfirmModal"; // ✅
import { DownloadButton } from "@/components/general/DownloadButton";
import { VideoPreviewModal } from "@/components/general/VideoPreviewModal";
import { PlayCircle, Box } from "lucide-react";
import { ComingSoonModal } from "@/components/customUI/ComingSoonModal";

export function ViewMod3d() {
  const [mod3d, setMod3d] = useState({});
  const [showConfirm, setShowConfirm] = useState(false); // ✅
  const [showVideo, setShowVideo] = useState(false); // ✅ video toggle
  const [show3DModal, setShow3DModal] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function loadModel() {
      const data = await getMod3d(id);
      data.dateCreated = new Date(data.dateCreated).toString();
      setMod3d(data);
    }
    loadModel();
  }, [id]);

  const handleDeleteConfirmed = async () => {
    try {
      await deleteMod3d(id);
      navigate("/home3d");
    } catch (error) {
      alert("Failed to delete model.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-900 text-stone-100 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-stone-800 rounded-xl shadow-lg p-6 border border-stone-700">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            ← Back
          </Button>
          {user?.id === mod3d.author?._id && (
            <div className="flex gap-2">
              <Link to={`/edit/${id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-all shadow-sm border border-red-500"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-amber-400 text-center mb-2">
          {mod3d.title}
        </h1>
        {mod3d.author && (
          <div className="flex justify-between items-center gap-2 text-stone-300 text-sm mb-1">
            <UserBadge user={mod3d.author} />
            <span>on {mod3d.dateCreated?.slice(4, 15)}</span>
          </div>
        )}

        <div className="w-full bg-black p-4 rounded-lg mb-6">
          <img
            src={mod3d.image}
            alt={mod3d.title}
            className="max-h-[400px] mx-auto object-contain"
          />
        </div>

        {/* ✅ Action buttons: View 3D + Download + Preview Video */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {/* View 3D */}
          <button
            onClick={() => setShow3DModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition"
          >
            <Box className="w-5 h-5" />
            View 3D
          </button>
          <ComingSoonModal
            isOpen={show3DModal}
            onClose={() => setShow3DModal(false)}
          />

          {/* Preview Video */}
          {mod3d.videoId && (
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg shadow 
                bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white transition"
            >
              <PlayCircle className="w-5 h-5" />
              Preview Video
            </button>
          )}

          {/* Download */}
          {mod3d.modelFiles?.length > 0 && (
            <DownloadButton
              files={mod3d.modelFiles}
              className="px-5 py-2.5 text-sm font-medium rounded-lg shadow 
                bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white transition"
            />
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-green-400">
          💰 {mod3d.price || "Free"}
        </h2>

        <p className="whitespace-pre-wrap text-lg leading-relaxed text-stone-200">
          {mod3d.description}
        </p>
      </div>

      {/* ✅ Confirm modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Model"
        message="Are you sure you want to delete this model? This action cannot be undone."
      />
      {/* ✅ Video modal */}
      <VideoPreviewModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl={`/api/file/stream/${mod3d.videoId}`}
      />
    </div>
  );
}
