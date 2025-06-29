import { useState, useRef } from "react";
import { createFile } from "@/api/fileApi";
import { updateProfilePic } from "@/api/usersApi";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export default function ProfilePicUploader({ currentPic, onUploadSuccess }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, or WEBP allowed");
      toast.error("Unsupported file type");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowModal(true);
    setError("");
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const result = await createFile(selectedFile);
      const key = result.key;

      const update = await updateProfilePic(key);
      if (!update.success) throw new Error();

      toast.success("Profile picture updated!");
      await new Promise((res) => setTimeout(res, 2000));
      onUploadSuccess(key);
      setShowModal(false);
    } catch (err) {
      toast.error("Upload failed");
      setError("Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clean currentPic of any existing query and cache-bust
  const cleanPicKey = currentPic ? currentPic.split("?")[0] : "";
  const profilePicUrl = cleanPicKey
    ? `/api/file/raw/${encodeURIComponent(cleanPicKey)}?t=${Date.now()}`
    : "/avatar.jpg";

  return (
    <div className="relative w-24 h-24">
      {/* Profile Image */}
      <img
        src={preview && !showModal ? preview : profilePicUrl}
        alt="Profile"
        className="w-full h-full aspect-square rounded-full object-center object-cover border border-stone-700"
      />

      {/* Pencil Icon */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 bg-stone-800 hover:bg-stone-700 border border-stone-600 p-1 rounded-full text-white shadow-md"
      >
        <Pencil size={16} />
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-stone-800 rounded-xl p-6 w-80 text-center shadow-lg border border-stone-700">
            <h2 className="text-lg font-semibold text-stone-100 mb-4">
              Confirm New Profile Picture
            </h2>
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border border-stone-600"
            />

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 bg-stone-600 hover:bg-stone-500 rounded text-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white"
              >
                {loading ? "Uploading..." : "Confirm"}
              </button>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
