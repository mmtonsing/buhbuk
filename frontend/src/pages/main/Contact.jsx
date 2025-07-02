import ContactForm from "@/components/general/ContactForm";
import {
  PageTitle,
  PageParagraph,
  SmallText,
} from "@/components/customUI/Typography";

export function Contact() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-stone-900 text-stone-200 pt-12 px-4 w-full mx-auto">
      <div className="text-center">
        <PageTitle className="text-amber-300 mb-6">
          🪵 Reach Out to BuhBuk
        </PageTitle>

        <PageParagraph className="mb-4">
          Whether you're building, dreaming, or simply wandering by the barn —
          we’d love to hear from you.
        </PageParagraph>

        {/* list */}
        <div className="my-6 space-y-2 text-stone-300 text-base sm:text-lg">
          <p>🤝 Collaborate on 3D or creative projects</p>
          <p>🎨 Feature your story, art, or indie tool</p>
          <p>💡 Suggest improvements or new features</p>
          <p>❓ Ask questions about using BuhBuk</p>
          <p>📅 Pitch event ideas or community challenges</p>
          <p>💌 Just to say hi or share encouragement 🧡</p>
        </div>

        <SmallText className="mt-4 text-orange-400 italic">
          This Buk is always open for dreamers, builders, and wanderers.
        </SmallText>
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
