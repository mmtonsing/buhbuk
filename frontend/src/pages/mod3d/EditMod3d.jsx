import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMod3d, editMod3d } from "@/api/mod3dsApi";
import { createFile } from "@/api/fileApi";
import { MessageBanner } from "@/components/customUI/MessageBanner";
import Loader from "@/components/customUI/Loader";
import { Label } from "@/components/ui/label";
import InfoTooltip from "@/components/customUI/InfoToolTip.jsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageTitle } from "@/components/customUI/Typography";

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
      if (form.imageFile) {
        const imgRes = await createFile(form.imageFile);
        if (!imgRes?.key) throw new Error("Image upload failed");
        updatedData.imageId = imgRes.key;
      }

      if (form.modelFile) {
        const ext = form.modelFile.name.split(".").pop().toLowerCase();

        if (ext === "zip") {
          const zipRes = await createFile(form.modelFile, true);
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
    <div className="flex flex-col flex-1 w-full h-auto max-w-3xl mx-auto px-4 py-4 bg-stone-1000 text-stone-100">
      {showBanner && (
        <MessageBanner
          message="Model updated successfully!"
          type="success"
          onClose={() => setShowBanner(false)}
        />
      )}

      <PageTitle className="mb-8 text-center text-amber-400">
        Edit your 3D Model
      </PageTitle>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-stone-800 p-8 rounded-xl border border-stone-700 shadow-md"
      >
        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Model Name*
            <InfoTooltip text="Give your model a short, descriptive title (max 100 characters)." />
          </Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Model name"
            maxLength={100}
            className="bg-stone-700 text-stone-100"
            required
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Price
            <InfoTooltip text="Leave empty for free. Otherwise, enter a numeric price (e.g., 10)." />
          </Label>
          <Input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Optional price"
            className="bg-stone-700 text-stone-100"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Description*
            <InfoTooltip text="Describe your 3D model (max 300 characters). Markdown not supported." />
          </Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Description"
            maxLength={300}
            className="bg-stone-700 text-stone-100"
            required
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Replace Image/Thumbnail*
            <InfoTooltip text="Image should represent your model. Max size: 10MB. Formats: jpg, jpeg, png." />
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="cursor-pointer bg-stone-700 text-stone-100"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Replace 3D Model*
            <InfoTooltip text="Upload a .zip containing your model files or a direct .glb, .obj, .stl, or .gltf file (max 50MB)." />
          </Label>
          <Input
            type="file"
            accept=".glb,.gltf,.obj,.stl,.zip"
            onChange={handleChange}
            className="cursor-pointer bg-stone-700 text-stone-100"
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Replace Demo Video
            <InfoTooltip text="Optional. File must be .mp4, .webm, or .mov (max 20MB). Used for model previews." />
          </Label>
          <Input
            type="file"
            accept=".mp4,.webm,.mov"
            onChange={handleChange}
            className="cursor-pointer bg-stone-700 text-stone-100"
          />
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="btn-buhbuk w-1/3 py-2 rounded-xl disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
