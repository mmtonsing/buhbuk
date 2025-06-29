import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

export default function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axiosInstance.get(`/posts/${id}`);
        setPost(data);

        // 🔀 Redirect to respective view page based on category
        const category = data.category;
        const refId = data.refId?._id;

        if (category === "Mod3d" && refId) {
          navigate(`/viewmod3d/${refId}`, { replace: true });
        } else if (category === "Blog" && refId) {
          navigate(`/viewblog/${refId}`, { replace: true });
        } else if (category === "Art" && refId) {
          navigate(`/viewart/${refId}`, { replace: true });
        } else {
          setLoading(false); // stay on fallback page
        }
      } catch (err) {
        console.error("Failed to load post", err);
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div className="p-4 text-stone-400">Loading...</div>;
  if (!post) return <div className="p-4 text-red-500">Post not found.</div>;

  // 🧩 Optional fallback view if redirect did not occur (e.g. unknown category)
  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2">{post.title || "Untitled"}</h1>
      <p className="text-sm text-stone-400 mb-4">Category: {post.category}</p>

      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt="Post preview"
          className="w-full h-auto max-h-[400px] object-contain bg-stone-800"
        />
      ) : (
        <div className="text-stone-400">No image available</div>
      )}

      {/* You can render post.summary or other fields here */}
    </div>
  );
}
