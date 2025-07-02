import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react"; // optional icon for flair
import { PageTitle, PageParagraph } from "@/components/customUI/Typography";
const categories = [
  {
    title: "3D Model",
    description: "Upload and share interactive 3D models.",
    path: "/uploadmod3d",
  },
  {
    title: "Graphics",
    description: "Showcase digital illustrations, designs, or artworks.",
    path: "/graphics",
  },
  {
    title: "Blog",
    description: "Write and post long-form content or updates.",
    path: "/blogs",
  },
];

export function SowPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 w-full h-auto bg-gradient-to-b from-stone-900 to-stone-950 text-white py-10 px-6">
      <div className="text-center mb-12">
        <PageTitle className="mb-4">Sow a New Crop</PageTitle>
        <PageParagraph className="max-w-2xl mx-auto">
          choose a variety to share your work.
        </PageParagraph>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map(({ title, description, path }) => (
          <div
            key={title}
            onClick={() => navigate(path)}
            className="p-6 flex flex-col flex-grow bg-stone-800/80 backdrop-blur border border-stone-700 hover:border-rose-600 rounded-2xl shadow-md hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-6 flex flex-col flex-grow">
              {/* Title */}
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-rose-600 w-5 h-5 group-hover:animate-pulse" />
                <h2 className="text-xl font-bold text-white drop-shadow-sm">
                  {title}
                </h2>
              </div>
              <p className="text-stone-400 text-sm mb-4">{description}</p>

              {/* Button pushed to bottom using mt-auto */}
              <button className="mt-auto w-full btn-buhbuk-rose-outline">
                Sow a {title}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
