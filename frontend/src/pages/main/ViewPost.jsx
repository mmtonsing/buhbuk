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

        // 🔀 Redirect if it's a Mod3d post (or other categories later)
        if (data.category === "Mod3d" && data.refId?._id) {
          navigate(`/viewmod3d/${data.refId._id}`, { replace: true });
        }
        if (data.category === "Blog") {
          navigate(`/viewblog/${data.refId._id}`);
        }
        setLoading(false);
        if (data.category === "Art") {
          navigate(`/viewart/${data.refId._id}`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load post", err);
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div className="p-4 text-stone-400">Loading...</div>;

  if (!post) return <div className="p-4 text-red-500">Post not found.</div>;

  // Optional fallback if no redirect happened
  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2">
        {post.refId?.title || "Untitled"}
      </h1>
      <p className="text-sm text-stone-400 mb-4">Category: {post.category}</p>
      <img
        src={post.image || `/api/file/public/${post.refId?.imageId}`}
        alt="Post preview"
        className="w-full h-auto max-h-[400px] object-contain bg-stone-800"
      />
      {/* You can optionally render other post details here */}
    </div>
  );
}
