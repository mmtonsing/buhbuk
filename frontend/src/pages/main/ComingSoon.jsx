import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ComingSoon({
  title = "Coming Soon",
  message = "We're working on something exciting.",
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen w-full bg-stone-950  items-center justify-center text-center text-stone-100 px-4">
      <div className="max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-accent tracking-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-stone-300 mb-8">{message}</p>
        <Button
          asChild
          className="bg-accent hover:bg-accent/80 text-accent-foreground px-6 py-3 rounded-2xl shadow-lg"
        >
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
