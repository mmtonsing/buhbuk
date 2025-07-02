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
        <div className="max-w-2xl mx-auto text-center my-6 space-y-2 text-stone-300 text-base sm:text-lg">
          <PageParagraph>
            🤝 Collaborate on projects 🎨 Feature your story, art, or indie tool
            💡 Suggest improvements or new features ❓ Ask questions about using
            BuhBuk 📅 Pitch event ideas or feedback
          </PageParagraph>
          <PageParagraph>
            💌 Just to say hi or share encouragement 🧡
          </PageParagraph>
        </div>

        <SmallText className="mt-4 text-orange-400 italic">
          This Buk is always open for dreamers, builders, and wanderers.
        </SmallText>
      </div>

      <div className="mt-1">
        <ContactForm />
      </div>
    </div>
  );
}
