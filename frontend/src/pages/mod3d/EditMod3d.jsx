import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMod3d, editMod3d, createFile } from "../../api/mod3ds";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { MessageBanner } from "@/components/customUI/MessageBanner";

export function EditMod3d() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
        modelFiles: mod.modelFiles || [], // use correct key
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

    const updatedData = {
      title: form.title,
      description: form.description,
      price: form.price,
      imageId: form.imageId,
      modelId: form.modelId,
      videoId: form.videoId,
    };

    try {
      // Upload and update files if provided
      if (form.imageFile) {
        const imgRes = await createFile(form.imageFile);
        updatedData.imageId = imgRes.data.key;
      }

      if (form.modelFile) {
        if (form.modelFile?.name?.endsWith(".zip")) {
          const zipForm = new FormData();
          zipForm.append("file", form.modelFile);

          const res = await axiosInstance.post("/file/zip", zipForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          updatedData.modelFiles = res.data.modelFiles; // array of files
        } else {
          const modelRes = await createFile(form.modelFile);
          updatedData.modelFiles = [
            {
              key: modelRes.data.key,
              type: form.modelFile.name.split(".").pop().toLowerCase(),
              originalName: form.modelFile.name,
            },
          ];
        }
      }

      if (form.videoFile) {
        const vidRes = await createFile(form.videoFile);
        updatedData.videoId = vidRes.data.key;
      }

      await editMod3d(id, updatedData);
      setShowBanner(true);

      setTimeout(() => {
        navigate(`/viewmod3d/${id}`);
      }, 500);
    } catch (err) {
      console.error("Failed to update mod:", err);
      alert("Error updating model.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-stone-900 text-stone-100">
      {showBanner && (
        <MessageBanner
          message="Model updated successfully!"
          type="success"
          onClose={() => setShowBanner(false)}
        />
      )}

      <div className="max-w-2xl mx-auto bg-stone-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-amber-400 text-center">
          Edit 3D Model
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 rounded bg-stone-700 text-white"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Description"
            className="w-full p-2 rounded bg-stone-700 text-white"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 rounded bg-stone-700 text-white"
          />

          <div>
            <label className="text-sm text-stone-400 mb-1 block">
              Replace image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-stone-700 text-white file:mr-2 file:p-1 file:border-0 file:rounded"
            />
          </div>

          <div>
            <label className="text-sm text-stone-400 mb-1 block">
              Replace 3D Model (.zip & .glb recommended, .gltf, .obj, .stl"-Max
              50MB)
            </label>
            <input
              type="file"
              accept=".glb, .gltf, .obj, .stl, .zip"
              onChange={handleChange}
              className="w-full bg-stone-700 text-white file:mr-2 file:p-1 file:border-0 file:rounded"
            />
          </div>

          <div>
            <label className="text-sm text-stone-400 mb-1 block">
              Replace Demo Video (".mp4,.webm,.mov"-Max 20MB)
            </label>
            <input
              type="file"
              accept=".mp4, .webm, .mov"
              onChange={handleChange}
              className="w-full bg-stone-700 text-white file:mr-2 file:p-1 file:border-0 file:rounded"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
