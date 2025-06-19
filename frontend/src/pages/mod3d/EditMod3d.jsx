import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMod3d, editMod3d, createImage } from "../../api/mod3ds";
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
    file: null,
    imageId: "", // original
  });

  useEffect(() => {
    async function loadModel() {
      const mod = await getMod3d(id);
      if (mod.author._id !== user?.id) {
        alert("Unauthorized");
        return navigate("/home3d");
      }

      setForm({
        title: mod.title || "",
        description: mod.description || "",
        price: mod.price || "",
        imageId: mod.imageId,
        file: null,
      });
    }
    loadModel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedData = {
      title: form.title,
      description: form.description,
      price: form.price,
      imageId: form.imageId, // default to original
    };

    try {
      if (form.file) {
        await createImage(form.file); // uploads to S3
        updatedData.imageId = form.file.name; // overwrite imageId
      }

      await editMod3d(id, updatedData);
      setShowBanner(true);
      setTimeout(() => {
        navigate(`/viewmod3d/${id}`);
      }, 1000);
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
              Upload new image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
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
