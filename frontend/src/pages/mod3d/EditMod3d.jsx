import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMod3d, editMod3d } from "../../api/mod3ds";
import { createFile } from "@/api/fileApi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { MessageBanner } from "@/components/customUI/MessageBanner";
import Loader from "@/components/customUI/Loader";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/customUI/InfoTooltip";

export function EditMod3d() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageId: "",
    modelFiles: [],
    videoId: "",
    imageFile: null,
    modelFile: null,
    videoFile: null,
  });

  useEffect(() => {
    async function loadModel() {
      const mod = await getMod3d(id);
      if (mod.author._id !== user?.id) {
        alert("Unauthorized");
        return navigate("/home3d");
      }

      setForm((prev) => ({
        ...prev,
        title: mod.title || "",
        description: mod.description || "",
        price: mod.price || "",
        imageId: mod.imageId || "",
        modelFiles: mod.modelFiles || [],
        videoId: mod.videoId || "",
      }));
    }

    loadModel();
  }, [id, user?.id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      const ext = file.name.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
        setForm((prev) => ({ ...prev, imageFile: file }));
      } else if (["glb", "gltf", "obj", "stl", "zip"].includes(ext)) {
        setForm((prev) => ({ ...prev, modelFile: file }));
      } else if (["mp4", "webm", "mov"].includes(ext)) {
        setForm((prev) => ({ ...prev, videoFile: file }));
      } else {
        alert("Unsupported file type.");
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      title: form.title,
      description: form.description,
      price: form.price,
      imageId: form.imageId,
      modelFiles: form.modelFiles,
      videoId: form.videoId,
    };

    try {
      // Upload image if updated
      if (form.imageFile) {
        const imgRes = await createFile(form.imageFile);
        if (!imgRes?.key) throw new Error("Image upload failed");
        updatedData.imageId = imgRes.key;
      }

      // ✅ Upload model (zip or single)
      if (form.modelFile) {
        const ext = form.modelFile.name.split(".").pop().toLowerCase();

        if (ext === "zip") {
          const zipRes = await createFile(form.modelFile, true); // use zip mode
          if (!zipRes.modelFiles?.length)
            throw new Error("Zip upload failed or no models extracted");

          updatedData.modelFiles = zipRes.modelFiles;
        } else {
          const modelRes = await createFile(form.modelFile);
          if (!modelRes?.key) throw new Error("Model upload failed");

          updatedData.modelFiles = [
            {
              key: modelRes.key,
              type: ext,
              originalName: form.modelFile.name,
            },
          ];
        }
      }

      // ✅ Upload video if updated
      if (form.videoFile) {
        const vidRes = await createFile(form.videoFile);
        if (!vidRes?.key) throw new Error("Video upload failed");
        updatedData.videoId = vidRes.key;
      }

      await editMod3d(id, updatedData);
      setShowBanner(true);

      setTimeout(() => {
        navigate(`/viewmod3d/${id}`);
      }, 500);
    } catch (err) {
      console.error("❌ Failed to update mod:", err);
      alert("Error updating model.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader message="Saving changes, please wait" overlay={true} />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 bg-stone-900 min-h-screen text-stone-100">
      {showBanner && (
        <MessageBanner
          message="Model updated successfully!"
          type="success"
          onClose={() => setShowBanner(false)}
        />
      )}

      <h2 className="text-3xl font-bold mb-8 text-center text-amber-400">
        Edit 3D Model
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-stone-800 p-8 rounded-xl border border-stone-700 shadow-md"
      >
        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Model Name*
            <InfoTooltip text="Give your model a short, descriptive title (max 100 characters)." />
          </Label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 rounded bg-stone-700 text-white"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Price{" "}
            <InfoTooltip text="Leave empty for free. Otherwise, enter a numeric price (e.g., 10)." />
          </Label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 rounded bg-stone-700 text-white"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Description*
            <InfoTooltip text="Describe your 3D model (max 300 characters). Markdown not supported." />
          </Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Description"
            className="w-full p-2 rounded bg-stone-700 text-white"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Replace Image/Thumbnail*
            <InfoTooltip text="Image should represent your model. Max size: 10MB. Formats: jpg, jpeg, png." />
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full bg-stone-700 text-white file:mr-2 file:p-1 file:border-0 file:rounded"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Replace 3D Model*
            <InfoTooltip text="Upload a .zip containing your model files or a direct .glb, .obj, .stl, or .gltf file (max 50MB)." />
          </Label>
          <input
            type="file"
            accept=".zip,.glb,.gltf,.obj,.stl"
            onChange={handleChange}
            className="w-full bg-stone-700 text-white file:mr-2 file:p-1 file:border-0 file:rounded"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Replace Demo Video
            <InfoTooltip text="Optional. File must be .mp4, .webm, or .mov (max 20MB). Used for model previews." />
          </Label>
          <input
            type="file"
            accept=".mp4,.webm,.mov"
            onChange={handleChange}
            className="w-full bg-stone-700 text-white file:mr-2 file:p-1 file:border-0 file:rounded"
          />
        </div>
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
