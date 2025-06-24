import { useState, useRef } from "react";
import { uploadMod3d } from "../../api/mod3ds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageBanner } from "@/components/customUI/MessageBanner";
import Loader from "@/components/customUI/Loader";
import { useNavigate } from "react-router-dom";
import { createFile } from "@/api/fileApi";
import { InfoTooltip } from "@/components/customUI/InfoToolTip";

export function UploadMod3d() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_MODEL_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

  const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "glb",
    "gltf",
    "obj",
    "stl",
    "zip",
    "mp4",
    "webm",
    "mov",
  ];

  const inputFile = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (price && isNaN(price)) {
      setPriceError("Price must be a number");
      return;
    }

    try {
      setLoading(true);

      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error("Please upload a valid thumbnail image.");
      }

      const imageRes = await createFile(imageFile);
      const imageId = imageRes.key;

      // Upload model(s)
      let modelFiles = [];
      const ext = modelFile.name.split(".").pop().toLowerCase();

      if (ext === "zip") {
        const zipRes = await createFile(modelFile, true);
        if (zipRes.modelFiles) {
          modelFiles = zipRes.modelFiles;
        } else {
          throw new Error("Zip upload failed or no models extracted.");
        }
      } else {
        const modelRes = await createFile(modelFile);
        modelFiles = [
          {
            key: modelRes.key,
            type: ext,
            originalName: modelFile.name,
          },
        ];
      }

      // Upload video (optional)
      let videoId = null;
      if (videoFile) {
        const videoRes = await createFile(videoFile);
        videoId = videoRes.key;
      }

      const payload = {
        title,
        price,
        description,
        imageId,
        modelFiles,
        videoId,
      };

      const newMod = await uploadMod3d(payload);
      resetForm();
      setMessage({ text: "✅ Model uploaded successfully!", type: "success" });

      setTimeout(() => {
        navigate(`/viewmod3d/${newMod._id}`);
      }, 800);
    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
      setMessage({
        text: "❌ Upload failed. Please try again.",
        type: "error",
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      alert(
        "Allowed file types: jpg, jpeg, png, glb, gltf, obj, stl, zip, mp4, webm, mov"
      );
      e.target.value = "";
      return;
    }

    // 🛑 File size checks per type
    if (["jpg", "jpeg", "png"].includes(ext)) {
      if (file.size > MAX_IMAGE_SIZE) {
        alert("Image file exceeds 10MB limit.");
        e.target.value = "";
        return;
      }
      setImageFile(file);
    } else if (["zip", "glb", "gltf", "obj", "stl"].includes(ext)) {
      if (file.size > MAX_MODEL_SIZE) {
        alert("Model file exceeds 50MB limit.");
        e.target.value = "";
        return;
      }
      setModelFile(file);
    } else if (["mp4", "webm", "mov"].includes(ext)) {
      if (file.size > MAX_VIDEO_SIZE) {
        alert("Video file exceeds 20MB limit.");
        e.target.value = "";
        return;
      }
      setVideoFile(file);
    }
  };

  const resetForm = () => {
    if (inputFile.current) inputFile.current.value = "";
    setTitle("");
    setPrice("");
    setDescription("");
    setImageFile(null);
    setModelFile(null);
    setVideoFile(null);
    setLoading(false);
  };

  if (loading)
    return (
      <Loader
        message="Uploading model, this may take some time"
        overlay={true}
      />
    );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 bg-stone-900 min-h-screen text-stone-100">
      {message && (
        <MessageBanner
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <h2 className="text-3xl font-bold mb-8 text-center text-amber-400">
        Upload your 3D Model
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
          <Input
            name="title"
            value={title}
            placeholder="Model name"
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-stone-700 text-stone-100"
            required
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Price{" "}
            <InfoTooltip text="Leave empty for free. Otherwise, enter a numeric price (e.g., 10)." />
          </Label>
          <Input
            name="price"
            value={price}
            placeholder="Optional price (e.g., 10)"
            onChange={(e) => {
              const val = e.target.value;
              setPrice(val);
              if (!val || !isNaN(val)) setPriceError("");
              else setPriceError("Price must be a number");
            }}
            className="bg-stone-700 text-stone-100"
          />
          {priceError && (
            <p className="text-red-400 text-sm mt-1">{priceError}</p>
          )}
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Description*
            <InfoTooltip text="Describe your 3D model (max 300 characters). Markdown not supported." />
          </Label>
          <Textarea
            name="description"
            value={description}
            maxLength={300}
            placeholder="Short description of your model"
            onChange={(e) => setDescription(e.target.value)}
            className="bg-stone-700 text-stone-100"
            required
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Upload Thumbnail*
            <InfoTooltip text="Image should represent your model. Max size: 10MB. Formats: jpg, jpeg, png." />
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            ref={inputFile}
            className="cursor-pointer bg-stone-700 text-stone-100"
            required
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Upload 3D Model*
            <InfoTooltip text="Upload a .zip containing your model files or a direct .glb, .obj, .stl, or .gltf file (max 50MB)." />
          </Label>
          <Input
            type="file"
            accept=".glb,.gltf,.obj,.stl,.zip"
            onChange={handleFileUpload}
            className="cursor-pointer bg-stone-700 text-stone-100"
            required
          />
        </div>

        <div>
          <Label className="text-sm text-stone-300 block mb-2">
            Upload Demo Video
            <InfoTooltip text="Optional. File must be .mp4, .webm, or .mov (max 20MB). Used for model previews." />
          </Label>
          <Input
            type="file"
            accept=".mp4,.webm,.mov"
            onChange={handleFileUpload}
            className="cursor-pointer bg-stone-700 text-stone-100"
          />
        </div>

        <div className="pt-4 text-center">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#59322d] hover:bg-[#47211f] text-stone-100 px-6 py-2 text-lg rounded-lg shadow-md disabled:opacity-50"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
