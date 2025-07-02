import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { PageTitle, PageParagraph } from "@/components/customUI/Typography";
import { Link } from "react-router-dom";

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

  if (loading)
    return (
      <div className="p-4 text-center">
        <PageParagraph className="text-stone-400 italic">
          Loading...
        </PageParagraph>
      </div>
    );
  if (!post)
    return (
      <div className="p-4 text-center">
        <PageParagraph className="text-red-500">Post not found.</PageParagraph>
        <Link
          to="/"
          className="inline-block mt-4 btn-buhbuk-outline px-4 py-2 rounded-xl"
        >
          Back to BuhBuk
        </Link>
      </div>
    );

  // 🧩 Optional fallback view if redirect did not occur (e.g. unknown category)
  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <PageTitle className="text-3xl mb-2">
        {post.title || "Untitled"}
      </PageTitle>
      <PageParagraph className="text-stone-400 italic mb-4">
        Category: {post.category}
      </PageParagraph>

      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt="Post preview"
          className="w-full h-auto max-h-[400px] object-contain bg-stone-800 rounded-xl"
        />
      ) : (
        <PageParagraph className="text-stone-500 italic">
          No image available
        </PageParagraph>
      )}
    </div>
  );
}
