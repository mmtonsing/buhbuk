import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../api/blogs"; // Your API
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-stone-400">
        Loading blog content...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-20 text-red-400">
        Blog not found or failed to load.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-4 text-amber-300">{blog.title}</h1>
        <div className="text-sm text-stone-400 mb-6 italic">
          by {blog.author?.username || "Unknown"} •{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>

        {/* Image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
          />
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none text-stone-200 leading-relaxed space-y-6">
          {blog.content?.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Button
            onClick={() => navigate(-1)}
            className="bg-amber-700 hover:bg-amber-800"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}
