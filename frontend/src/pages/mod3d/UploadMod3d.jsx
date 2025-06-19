import { useState, useRef } from "react";
import { uploadMod3d } from "../../api/mod3ds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageBanner } from "@/components/customUI/MessageBanner";
import Loader from "@/components/customUI/Loader";
import { useNavigate } from "react-router-dom";

export function UploadMod3d() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const inputFile = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (price && isNaN(price)) {
      setPriceError("Price must be a number");
      return;
    }

    const submitObject = {
      title,
      price,
      description,
      author: null,
      dateCreated: new Date(),
      file,
    };

    try {
      setLoading(true);

      const newMod = await uploadMod3d(submitObject);

      // ✅ Ensure file input reset before leaving DOM
      if (inputFile.current) {
        inputFile.current.value = "";
      }

      // ✅ Reset form before navigation
      setTitle("");
      setPrice("");
      setDescription("");
      setFile(null);
      setLoading(false);

      if (!newMod || !newMod._id) {
        throw new Error("Upload succeeded but no ID returned.");
      }

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
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
      alert("Files must be jpg, jpeg, or png");
      if (inputFile.current) inputFile.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 2MB limit");
      if (inputFile.current) inputFile.current.value = "";
      return;
    }

    setFile(file);
  };

  if (loading) return <Loader message="Uploading model..." />;

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
        Upload a New 3D Model
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-stone-800 p-8 rounded-xl border border-stone-700 shadow-md"
      >
        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Model Name
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
          <Label className="text-sm text-stone-300 mb-1 block">Price</Label>
          <Input
            name="price"
            value={price}
            placeholder="Optional price (e.g., 10)"
            onChange={(e) => {
              const val = e.target.value;
              setPrice(val);
              if (!val || !isNaN(val)) {
                setPriceError("");
              } else {
                setPriceError("Price must be a number");
              }
            }}
            className="bg-stone-700 text-stone-100"
          />
          {priceError && (
            <p className="text-red-400 text-sm mt-1">{priceError}</p>
          )}
        </div>

        <div>
          <Label className="text-sm text-stone-300 mb-1 block">
            Description
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
            Upload Thumbnail (png, jpg, jpeg — max 2MB)
          </Label>
          <Input
            type="file"
            onChange={handleFileUpload}
            ref={inputFile}
            className="cursor-pointer bg-stone-700 text-stone-100 file:bg-stone-700 file:border-none file:text-stone-300 hover:file:bg-stone-600"
            required
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
