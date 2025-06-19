export function BlogCard({ blog }) {
  return (
    <div className="rounded-xl bg-stone-800 hover:bg-stone-700 transition shadow-md border border-stone-700 overflow-hidden flex flex-col h-full">
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-40 bg-stone-700 flex items-center justify-center text-stone-400">
          No Image
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-stone-100 mb-1">
          {blog.title}
        </h3>
        <p className="text-sm text-stone-400 line-clamp-3 mb-2">
          {blog.excerpt || blog.content.slice(0, 100) + "..."}
        </p>
        <div className="mt-auto text-xs text-stone-500 italic">
          by {blog.author?.username || "Unknown"} •{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
