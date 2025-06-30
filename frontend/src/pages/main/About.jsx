import { CardAction } from "@/components/ui/card";

export function About() {
  return (
    <div className="flex flex-col flex-1 w-full h-auto bg-stone-900 text-stone-200">
      <div className="scroll-mt-20 py-16 bg-stone-800 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-[#d5bdaf] mb-10">
            About BuhBuk
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              A Granary for Creativity — Rooted in Us.
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              <strong>BuhBuk</strong> comes from the word meaning a{" "}
              <em>granary or barn</em> — a place to store and nurture what we
              harvest. BuhBuk is more than a creative platform — it’s a
              storehouse for your stories, sketches, and sparks. A warm, digital
              barn for artists, writers, makers, and wanderers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              ✨ Our Vision
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              We believe that creativity is like a harvest — it needs time,
              space, and care. Whether you build in 3D, write stories, craft
              tools, or capture moments — BuhBuk is your granary of ideas. A
              place to store, share, and grow what matters.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🧰 What You Can Do Here
            </h2>
            <ul className="list-disc ml-6 text-base md:text-lg space-y-2">
              <li>
                🌀 Share 3D Models — Upload and showcase interactive creations.
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
              BuhBuk is built by <strong>Langmuanmung Tonsing</strong>, a
              full-stack developer and creative soul from the Paite community.
              What started as a personal hut for expression is now growing into
              a barn for all dreamers. No matter your background — you belong
              here.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🌿 Why BuhBuk?
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              In a world chasing fast trends, BuhBuk invites you to slow down
              and store what truly matters. Here, we honor story, craft, and
              substance. Whether you’re just starting or seasoned in your
              creative path — this is your granary of growth and connection.
            </p>
          </section>

          <CardAction className="flex flex-col bg-stone-700/50 relative rounded p-4 md:p-6 font-mono text-sm md:text-base font-semibold text-orange-600 max-w-xl mx-auto text-center space-y-4">
            <blockquote className="mt-4 border-l-2 border-orange-400 pl-4 italic text-stone-400">
              &quot;A barn for ideas. A fire for your craft. A granary for all
              seasons.&quot;
            </blockquote>
            <p className="text-lg font-semibold text-orange-500">
              BuhBuk is yours — to build, share, connect, and imagine.
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
