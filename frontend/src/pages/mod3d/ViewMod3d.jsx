import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlayCircle, Box, X } from "lucide-react";
import { getMod3d, deleteMod3d } from "@/api/mod3dsApi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserBadge } from "@/components/user/UserBadge";
import { ConfirmModal } from "@/components/customUI/DeleteConfirmModal";
import { DownloadButton } from "@/components/general/DownloadButton";
import { VideoPreviewModal } from "@/components/general/VideoPreviewModal";
import Loader from "@/components/customUI/Loader";
import HybridViewer from "@/components/mod3d/HybridViewer";
import { getRenderableModelFile } from "@/utils/getRenderableModelFile";

export function ViewMod3d() {
  const [mod3d, setMod3d] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function loadModel() {
      try {
        const data = await getMod3d(id);
        data.createdAt = new Date(data.createdAt).toString();
        setMod3d(data);
      } catch (err) {
        console.error("❌ Failed to load model", err);
      } finally {
        setLoading(false);
      }
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

  const renderableFile = getRenderableModelFile(mod3d.modelFiles);
  if (loading) return <Loader message="Loading 3D Model" />;
  if (downloading) {
    return (
      <Loader
        message="Preparing download, please wait"
        color="border-emerald-400 text-emerald-400"
        overlay={true}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen w-full bg-stone-900 text-stone-100 px-4 py-10">
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
            <UserBadge user={mod3d.author} className="p-2 text-xs" />
            <span>{mod3d.createdAt?.slice(4, 15)}</span>
          </div>
        )}

        <div className="w-full bg-black p-4 rounded-lg mb-6">
          {mod3d.imageId ? (
            <img
              src={mod3d.imageUrl}
              alt={mod3d.title}
              className="max-h-[400px] mx-auto object-contain"
            />
          ) : (
            <p className="text-center text-red-400">No image available</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={() => setShow3DModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition"
          >
            <Box className="w-5 h-5" />
            3D View
          </button>
          {mod3d.videoId && (
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg shadow bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white transition"
            >
              <PlayCircle className="w-5 h-5" />
              Preview Video
            </button>
          )}
          {mod3d.modelFiles?.length > 0 &&
            (user ? (
              <DownloadButton
                files={mod3d.modelFiles}
                onStart={() => setDownloading(true)}
                onEnd={() => setDownloading(false)}
                className="px-5 py-2.5 text-sm font-medium rounded-lg shadow bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white transition"
              />
            ) : (
              <button
                disabled
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-600 text-white cursor-not-allowed"
              >
                🔒 Login to download
              </button>
            ))}
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-green-400">
          💰 {mod3d.price || "Free"}
        </h2>

        <p className="whitespace-pre-wrap text-lg leading-relaxed text-stone-200">
          {mod3d.description}
        </p>
      </div>

      {/* Delete modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Model"
        message="Are you sure you want to delete this model? This action cannot be undone."
      />

      {/* Video modal */}
      <VideoPreviewModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl={mod3d.videoUrl}
      />

      {/* 3D Modal */}
      {show3DModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={(el) => (window.viewerContainer = el)}
            className="relative w-full max-w-4xl h-[80vh] bg-stone-900 rounded-xl border border-stone-700 shadow-lg flex flex-col overflow-hidden"
          >
            <button
              onClick={() => setShow3DModal(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-red-600 text-2xl z-10"
            >
              <X />
            </button>

            <button
              onClick={() => {
                const el = window.viewerContainer;
                if (!document.fullscreenElement) {
                  el?.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="absolute bottom-3 right-4 z-10 px-3 py-1.5 text-5xl font-medium bg-transparent hover:font-extrabold text-white rounded shadow"
            >
              ⛶
            </button>

            <div className="flex-1 flex items-center justify-center">
              {renderableFile ? (
                <HybridViewer
                  modelUrl={`/api/file/raw/${encodeURIComponent(
                    renderableFile.key
                  )}`}
                />
              ) : (
                <p className="text-center text-red-400">
                  No model available for preview.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
