// src/components/BlogSection.jsx
export default function BlogSection() {
  const dummyBlogs = [
    {
      title: "Digital Design & Identity",
      excerpt: "Exploring cultural roots through creative expression.",
    },
    {
      title: "The Future of 3D on the Web",
      excerpt: "3D storytelling is changing the web landscape.",
    },
    {
      title: "Weaving Stories from the Northeast",
      excerpt: "A look into indigenous textile art and the stories they carry.",
    },
    {
      title: "Reviving Lost Scripts",
      excerpt:
        "How digital tools are helping preserve endangered writing systems.",
    },
    {
      title: "Photographing Urban Tribes",
      excerpt:
        "A visual journey through local subcultures and street identities.",
    },
    {
      title: "Diaspora Diaries",
      excerpt: "Personal essays on growing up between cultures and continents.",
    },
    {
      title: "Sacred Geometry in Modern Art",
      excerpt: "Blending ancient symbolism with digital aesthetics.",
    },
    {
      title: "Voices from the Village",
      excerpt:
        "Oral storytelling traditions reimagined through podcasts and video.",
    },
    {
      title: "AR & Cultural Heritage",
      excerpt: "Using AR to bring ancient monuments and rituals to life.",
    },
    {
      title: "Zines, Resistance & Youth Culture",
      excerpt: "The underground revival of printed self-expression.",
    },
  ];

  return (
    <div className="mt-12 px-4 sm:px-8">
      <h2 className="text-3xl font-semibold text-white mb-6">Featured Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyBlogs.map((blog, idx) => (
          <div
            key={idx}
            className="bg-[var(--color-deepbrown)] text-white border border-[#333] rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h3 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
              {blog.title}
            </h3>
            <p className="text-sm mt-2 text-[#CCCCCC]">{blog.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
