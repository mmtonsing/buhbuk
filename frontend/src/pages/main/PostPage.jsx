import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react"; // optional icon for flair

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

export function PostPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-900 to-stone-950 text-white py-14 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Create a New Post
        </h1>
        <p className="text-stone-400 text-md sm:text-lg lg:text-xl">
          Start posting — choose a category to share your work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map(({ title, description, path }) => (
          <Card
            key={title}
            className="bg-stone-800/80 backdrop-blur border border-stone-700 hover:border-pink-500 rounded-2xl shadow-md hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer group flex flex-col"
            onClick={() => navigate(path)}
          >
            <CardContent className="p-6 flex flex-col flex-grow">
              {/* Title */}
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-pink-500 w-5 h-5 group-hover:animate-pulse" />
                <h2 className="text-xl font-bold text-white drop-shadow-sm">
                  {title}
                </h2>
              </div>
              <p className="text-stone-400 text-sm mb-4">{description}</p>

              {/* Button pushed to bottom using mt-auto */}
              <Button
                variant="outline"
                className="mt-auto w-full border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white"
              >
                Go to {title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
