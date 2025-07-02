import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlayCircle, Box, X } from "lucide-react";
import { getMod3d, deleteMod3d } from "@/api/mod3dsApi";
import { useAuth } from "@/context/AuthContext";
import { UserBadge } from "@/components/user/UserBadge";
import { ConfirmModal } from "@/components/customUI/DeleteConfirmModal";
import { DownloadButton } from "@/components/general/DownloadButton";
import { VideoPreviewModal } from "@/components/general/VideoPreviewModal";
import Loader from "@/components/customUI/Loader";
import HybridViewer from "@/components/mod3d/HybridViewer";
import { getRenderableModelFile } from "@/utils/getRenderableModelFile";
import {
  PageTitle,
  PageSubtitle,
  PageParagraph,
} from "@/components/customUI/Typography";

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
      <div className="max-w-5xl mx-auto bg-stone-800 rounded-2xl shadow-xl p-8 border border-stone-700">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn-buhbuk-outline px-4 py-2"
          >
            ← Back
          </button>
          {user?.id === mod3d.author?._id && (
            <div className="flex gap-2">
              <Link to={`/edit/${id}`}>
                <button className="btn-buhbuk-outline px-4 py-2">Edit</button>
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-buhbuk-rose-outline px-4"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        <PageTitle className="text-center text-amber-400 mb-2">
          {mod3d.title}
        </PageTitle>

        {mod3d.author && (
          <div className="flex justify-between items-center gap-2 text-stone-300 text-sm mb-4">
            <UserBadge user={mod3d.author} className="p-2 text-xs" />
            <span>{mod3d.createdAt?.slice(4, 15)}</span>
          </div>
        )}

        <div className="w-full bg-black p-4 rounded-lg mb-6">
          {mod3d.imageId ? (
            <img
              src={mod3d.imageUrl}
              alt={mod3d.title}
              className="max-h-[500px] w-full mx-auto object-contain rounded"
            />
          ) : (
            <p className="text-center text-red-400">No image available</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6 mb-6">
          <button
            onClick={() => setShow3DModal(true)}
            className="btn-buhbuk px-4 py-2 flex items-center gap-2"
          >
            <Box className="w-5 h-5" /> 3D View
          </button>
          {mod3d.videoId && (
            <button
              onClick={() => setShowVideo(true)}
              className="btn-buhbuk-dark px-5 py-2.5 flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" /> Preview Video
            </button>
          )}
          {mod3d.modelFiles?.length > 0 ? (
            user ? (
              <DownloadButton
                files={mod3d.modelFiles}
                onStart={() => setDownloading(true)}
                onEnd={() => setDownloading(false)}
                className="btn-buhbuk px-5 py-2.5"
              />
            ) : (
              <button
                disabled
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-600 text-white cursor-not-allowed"
              >
                🔒 Login to download
              </button>
            )
          ) : null}
        </div>

        <PageSubtitle className="text-green-400 mb-2">
          💰 {mod3d.price || "Free"}
        </PageSubtitle>

        <PageParagraph className="text-lg text-stone-200">
          {mod3d.description}
        </PageParagraph>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Model"
        message="Are you sure you want to delete this model? This action cannot be undone."
      />

      <VideoPreviewModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl={mod3d.videoUrl}
      />

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
