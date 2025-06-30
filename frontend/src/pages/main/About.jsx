import { CardAction } from "@/components/ui/card";

export function About() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-stone-900 text-stone-200">
      <div className="scroll-mt-20 py-16 bg-stone-800 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-5xl font-extrabold tracking-tight  text-[#d5bdaf] mb-10">
            About EimiBuk
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              A Creative Shelter — Rooted in Us.
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              <strong>Eimi</strong> means <em>our people</em>.{" "}
              <strong>Buk</strong> means <em>shelter</em> in Paite. EimiBuk is
              more than just a creative platform — it’s a place where your
              stories, sketches, and sparks are nurtured and celebrated. A cozy,
              digital hearth for artists, writers, makers, and wanderers alike.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              ✨ Our Vision
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              We believe that creativity thrives in warmth and belonging.
              Whether you design in 3D, share stories, craft code, or capture
              beauty through a lens — EimiBuk is your cabin in the storm. A
              haven where your voice matters and your passions take root.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🧰 What You Can Do Here
            </h2>
            <ul className="list-disc ml-6 text-base md:text-lg space-y-2">
              <li>
                🌀 Share 3D Models — Upload `.glb` files and showcase
                interactive creations.
              </li>
              <li>
                📷 Publish Art & Photography — Display your portfolio and
                behind-the-scenes process.
              </li>
              <li>
                ✍️ Write & Reflect — Blog your journey, tutorials, or cultural
                insights.
              </li>
              <li>
                🛒 Shop & Sell — <em>Coming soon:</em> a warm, creator-friendly
                marketplace.
              </li>
              <li>
                🎭 Join Community — Participate in events, workshops, and
                seasonal bonfires.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🔧 Crafted by Heart, Open to All
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              EimiBuk is built by <strong>Langmuanmung Tonsing</strong>, a
              full-stack developer and creative soul from the Paite community.
              What started as a personal hut for expression is now growing into
              a nest for everyone. No matter your background — you belong here.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🌿 Why EimiBuk?
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              In a world chasing trends, EimiBuk invites you to slow down and
              build something meaningful. Here, we return to soul, storytelling,
              and substance. From curious beginners to seasoned pros — this is
              your home for creation and connection.
            </p>
          </section>

          <CardAction className="flex flex-col bg-stone-700/50 relative rounded p-4 md:p-6 font-mono text-sm md:text-base font-semibold text-orange-600 max-w-xl mx-auto text-center space-y-4">
            <blockquote className="mt-4 border-l-2 border-orange-400 pl-4 italic text-stone-400">
              &quot;A nest for ideas. A fire for your craft. A hut for all
              seasons.&quot;
            </blockquote>
            <p className="text-lg font-semibold text-orange-500">
              EimiBuk is yours — to build, share, connect, and imagine.
            </p>
            <p>💬 Got an idea or tool? 💡 Want to collaborate or co-create?</p>
            <p>
              ✍️ Reach out. ✨ Contribute. ☕ Support us. 🔗 Be part of the Buk.
            </p>
          </CardAction>
        </div>
      </div>
    </div>
  );
}
