import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  PlayCircle,
  Box,
  X,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>{mod3d.title} | BuhBuk</title>
        <meta
          name="description"
          content={mod3d.description || "Explore this 3D model on BuhBuk"}
        />
        <meta property="og:title" content={mod3d.title} />
        <meta
          property="og:description"
          content={mod3d.description || "Check out this creation"}
        />
        <meta property="og:image" content={mod3d.imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

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
                  className="btn-buhbuk-rose-outline px-4 py-2"
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
              {/* Share Section */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <span className="text-sm text-stone-400">Share:</span>
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}&text=${encodeURIComponent(mod3d.title)}`,
                      "_blank"
                    )
                  }
                  className="flex items-center gap-1"
                >
                  <Twitter className="w-4 h-4" /> Twitter
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  className=" flex items-center gap-1"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://api.whatsapp.com/send?text=${encodeURIComponent(
                        mod3d.title + " " + window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                  className=" flex items-center gap-1"
                >
                  <LinkIcon className="w-4 h-4" /> WhatsApp
                </button>
              </div>
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

          {/* Responsive and compact button group */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-5 lg:gap-6 mt-6 mb-6 [&>button]:px-2 [&>button]:py-1 [&>button]:text-xs sm:[&>button]:text-sm sm:[&>button]:px-3 sm:[&>button]:py-1.5">
            <button
              onClick={() => setShow3DModal(true)}
              className="btn-buhbuk flex items-center gap-1 sm:gap-2"
            >
              <Box className="w-4 h-4 sm:w-5 sm:h-5" /> 3D View
            </button>

            {mod3d.videoId && (
              <button
                onClick={() => setShowVideo(true)}
                className="btn-buhbuk flex items-center gap-1 sm:gap-2"
              >
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Preview Video
              </button>
            )}

            {mod3d.modelFiles?.length > 0 &&
              (user ? (
                <DownloadButton
                  files={mod3d.modelFiles}
                  onStart={() => setDownloading(true)}
                  onEnd={() => setDownloading(false)}
                  className="btn-buhbuk flex items-center gap-1 sm:gap-2"
                />
              ) : (
                <button
                  disabled
                  className="btn-buhbuk-outline bg-gray-600 text-white cursor-not-allowed"
                >
                  🔒 Login to download
                </button>
              ))}
          </div>

          <PageParagraph className="text-lg text-stone-200">
            {mod3d.description}
          </PageParagraph>

          <div className="flex justify-between items-center mb-4">
            <PageSubtitle className="text-green-400">
              💰 {mod3d.price || "Free"}
            </PageSubtitle>
            <span className="text-sm text-stone-400">
              {mod3d.createdAt?.slice(4, 15)}
            </span>
          </div>
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
    </>
  );
}

// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { PlayCircle, Box, X } from "lucide-react";
// import { getMod3d, deleteMod3d } from "@/api/mod3dsApi";
// import { useAuth } from "@/context/AuthContext";
// import { UserBadge } from "@/components/user/UserBadge";
// import { ConfirmModal } from "@/components/customUI/DeleteConfirmModal";
// import { DownloadButton } from "@/components/general/DownloadButton";
// import { VideoPreviewModal } from "@/components/general/VideoPreviewModal";
// import Loader from "@/components/customUI/Loader";
// import HybridViewer from "@/components/mod3d/HybridViewer";
// import { getRenderableModelFile } from "@/utils/getRenderableModelFile";
// import {
//   PageTitle,
//   PageSubtitle,
//   PageParagraph,
// } from "@/components/customUI/Typography";

// export function ViewMod3d() {
//   const [mod3d, setMod3d] = useState({});
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showVideo, setShowVideo] = useState(false);
//   const [show3DModal, setShow3DModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [downloading, setDownloading] = useState(false);

//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     async function loadModel() {
//       try {
//         const data = await getMod3d(id);
//         data.createdAt = new Date(data.createdAt).toString();
//         setMod3d(data);
//       } catch (err) {
//         console.error("❌ Failed to load model", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadModel();
//   }, [id]);

//   const handleDeleteConfirmed = async () => {
//     try {
//       await deleteMod3d(id);
//       navigate("/home3d");
//     } catch (error) {
//       alert("Failed to delete model.");
//       console.error(error);
//     }
//   };

//   const renderableFile = getRenderableModelFile(mod3d.modelFiles);
//   if (loading) return <Loader message="Loading 3D Model" />;
//   if (downloading) {
//     return (
//       <Loader
//         message="Preparing download, please wait"
//         color="border-emerald-400 text-emerald-400"
//         overlay={true}
//       />
//     );
//   }

//   return (
//     <div className="flex flex-col flex-1 min-h-screen w-full bg-stone-900 text-stone-100 px-4 py-10">
//       <div className="max-w-5xl mx-auto bg-stone-800 rounded-2xl shadow-xl p-8 border border-stone-700">
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="btn-buhbuk-outline px-4 py-2"
//           >
//             ← Back
//           </button>
//           {user?.id === mod3d.author?._id && (
//             <div className="flex gap-2">
//               <Link to={`/edit/${id}`}>
//                 <button className="btn-buhbuk-outline px-4 py-2">Edit</button>
//               </Link>
//               <button
//                 onClick={() => setShowConfirm(true)}
//                 className="btn-buhbuk-rose-outline px-4 py-2"
//               >
//                 🗑️ Delete
//               </button>
//             </div>
//           )}
//         </div>

//         <PageTitle className="text-center text-amber-400 mb-2">
//           {mod3d.title}
//         </PageTitle>

//         {mod3d.author && (
//           <div className="flex justify-between items-center gap-2 text-stone-300 text-sm mb-4">
//             <UserBadge user={mod3d.author} className="p-2 text-xs" />
//             <span>{mod3d.createdAt?.slice(4, 15)}</span>
//           </div>
//         )}

//         <div className="w-full bg-black p-4 rounded-lg mb-6">
//           {mod3d.imageId ? (
//             <img
//               src={mod3d.imageUrl}
//               alt={mod3d.title}
//               className="max-h-[500px] w-full mx-auto object-contain rounded"
//             />
//           ) : (
//             <p className="text-center text-red-400">No image available</p>
//           )}
//         </div>

//         {/* Responsive and compact button group */}
//         <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 lg:gap-5 mt-6 mb-6 [&>button]:px-2 [&>button]:py-1 [&>button]:text-xs sm:[&>button]:text-sm sm:[&>button]:px-3 sm:[&>button]:py-1.5">
//           <button
//             onClick={() => setShow3DModal(true)}
//             className="btn-buhbuk flex items-center gap-1 sm:gap-2"
//           >
//             <Box className="w-4 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" /> 3D View
//           </button>

//           {mod3d.videoId && (
//             <button
//               onClick={() => setShowVideo(true)}
//               className="btn-buhbuk flex items-center gap-1 sm:gap-2"
//             >
//               <PlayCircle className="w-4 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />{" "}
//               Preview Video
//             </button>
//           )}

//           {mod3d.modelFiles?.length > 0 &&
//             (user ? (
//               <DownloadButton
//                 files={mod3d.modelFiles}
//                 onStart={() => setDownloading(true)}
//                 onEnd={() => setDownloading(false)}
//                 className="btn-buhbuk flex items-center gap-1 sm:gap-2 lg:gap-3"
//               />
//             ) : (
//               <button
//                 disabled
//                 className="btn-buhbuk-outline  bg-gray-600 text-white cursor-not-allowed"
//               >
//                 🔒 Login to download
//               </button>
//             ))}
//         </div>

//         <PageSubtitle className="text-green-400 mb-2">
//           💰 {mod3d.price || "Free"}
//         </PageSubtitle>

//         <PageParagraph className="text-lg text-stone-200">
//           {mod3d.description}
//         </PageParagraph>
//       </div>

//       <ConfirmModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleDeleteConfirmed}
//         title="Delete Model"
//         message="Are you sure you want to delete this model? This action cannot be undone."
//       />

//       <VideoPreviewModal
//         isOpen={showVideo}
//         onClose={() => setShowVideo(false)}
//         videoUrl={mod3d.videoUrl}
//       />

//       {show3DModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div
//             ref={(el) => (window.viewerContainer = el)}
//             className="relative w-full max-w-4xl h-[80vh] bg-stone-900 rounded-xl border border-stone-700 shadow-lg flex flex-col overflow-hidden"
//           >
//             <button
//               onClick={() => setShow3DModal(false)}
//               className="absolute top-2 right-2 text-stone-400 hover:text-red-600 text-2xl z-10"
//             >
//               <X />
//             </button>

//             <button
//               onClick={() => {
//                 const el = window.viewerContainer;
//                 if (!document.fullscreenElement) {
//                   el?.requestFullscreen();
//                 } else {
//                   document.exitFullscreen();
//                 }
//               }}
//               className="absolute bottom-3 right-4 z-10 px-3 py-1.5 text-5xl font-medium bg-transparent hover:font-extrabold text-white rounded shadow"
//             >
//               ⛶
//             </button>

//             <div className="flex-1 flex items-center justify-center">
//               {renderableFile ? (
//                 <HybridViewer
//                   modelUrl={`/api/file/raw/${encodeURIComponent(
//                     renderableFile.key
//                   )}`}
//                 />
//               ) : (
//                 <p className="text-center text-red-400">
//                   No model available for preview.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
