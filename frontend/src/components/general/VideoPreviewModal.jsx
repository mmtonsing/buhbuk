// components/customUI/VideoPreviewModal.jsx
export function VideoPreviewModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center px-4 py-2 border-b border-stone-700">
          <h3 className="text-white text-lg font-semibold">🎥 Video Preview</h3>
          <button onClick={onClose} className="text-white text-xl">
            ✖
          </button>
        </div>
        <div className="p-4">
          <video controls className="w-full max-h-[70vh] rounded">
            <source src={videoUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
