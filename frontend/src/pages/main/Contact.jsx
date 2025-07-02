import ContactForm from "@/components/general/ContactForm";

export function Contact() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-stone-900 text-stone-200 pt-12 px-4 w-full mx-auto">
      <div className="text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-amber-300 mb-6">
          🪵 Reach Out to BuhBuk
        </h1>
        <p className="text-lg leading-7 mb-4 text-stone-300">
          Whether you're building, dreaming, or simply wandering by the barn —
          we’d love to hear from you.
        </p>

        {/* list */}
        <div className="my-6 space-y-2 text-stone-300">
          <p>🤝 Collaborate on 3D or creative projects</p>
          <p>🎨 Feature your story, art, or indie tool</p>
          <p>💡 Suggest improvements or new features</p>
          <p>❓ Ask questions about using BuhBuk</p>
          <p>📅 Pitch event ideas or community challenges</p>
          <p>💌 Just to say hi or share encouragement 🧡</p>
        </div>

        <p className="text-md mt-4 text-orange-400 italic">
          This Buk is always open for dreamers, builders, and wanderers.
        </p>
      </div>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
