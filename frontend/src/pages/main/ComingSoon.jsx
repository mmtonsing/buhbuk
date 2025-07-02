import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageTitle, PageParagraph } from "@/components/customUI/Typography";

export function ComingSoon({
  title = "Coming Soon",
  message = "We're working on something exciting.",
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen w-full bg-stone-950 items-center justify-center text-center text-stone-100 px-4">
      <div className="max-w-xl">
        <PageTitle className="text-amber-300 mb-4">{title}</PageTitle>
        <PageParagraph className="text-lg sm:text-xl text-stone-300 mb-8">
          {message}
        </PageParagraph>

        <Link
          to="/"
          className="btn-buhbuk-outline px-6 py-3 rounded-2xl shadow-lg"
        >
          Back to BuhBuk
        </Link>
      </div>
    </div>
  );
}
