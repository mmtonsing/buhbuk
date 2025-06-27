import { CardAction } from "@/components/ui/card";

export function About() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-stone-900 text-stone-200">
      <div className="scroll-mt-20 py-16 bg-stone-800 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-orange-500 mb-10">
            🔥 About BukWarm
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              A Cozy Nest for Creativity — Built for Makers, Dreamers, and the
              Wildly Original.
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              BukWarm blends the essence of <em>“Buk”</em> —meaning hut, bird's
              nest or basically a shelter in the Paite language — and{" "}
              <em>“Warm”</em>, the comfort of belonging and expression. It's
              more than a creative platform — it’s a digital fireplace where
              artists, coders, storytellers, and curious souls gather,
              collaborate, and share their creations with the world.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              ✨ Our Vision
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              We believe everyone has a spark. BukWarm is your cozy space to
              light it. Whether you create in 3D, write long form, capture life
              through a lens, or build tools — this is your cabin in the storm.
              A digital nest where creativity can hatch, grow, and fly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🧰 What You Can Do Here
            </h2>
            <ul className="list-disc ml-6 text-base md:text-lg space-y-2">
              <li>
                🌀 Share 3D Models — Upload `.glb` files, describe your work,
                and let others explore them.
              </li>
              <li>
                📷 Publish Art & Photography — Showcase your visual work,
                portfolios, and creative process.
              </li>
              <li>
                ✍️ Blog & Reflect — Write stories, tutorials, or cultural
                thoughts in a personalized creator space.
              </li>
              <li>
                🛒 Shop & Sell — <em>Coming soon:</em> a creator-friendly
                marketplace for digital and handmade goods.
              </li>
              <li>
                🎭 Events & Community — Join challenges, virtual bonfires,
                workshops, and seasonal exhibitions.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🔧 Built with Passion, Open for All
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              BukWarm is created by <strong>Langmuanmung Tonsing</strong> — a
              Computer Science Engineer, full-stack developer and explorer from
              the Paite community. What began as a quiet personal project is now
              a growing creative refuge. Whether you're just starting out or
              already thriving — there's room here for you.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-b border-stone-600 pb-2 mb-4">
              🌿 Why BukWarm?
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              In a world chasing trends and algorithms, BukWarm invites you to
              slow down, nest in, and create from the heart. This is a rejection
              of burnout and a return to soul, storytelling, and substance.
              Whether you’re a hobbyist, student, or seasoned pro — this is your
              warm creative hut.
            </p>
          </section>

          <CardAction className="flex flex-col bg-stone-700/50 relative rounded p-4 md:p-6 font-mono text-sm md:text-base font-semibold text-orange-600 max-w-xl mx-auto text-center space-y-4">
            <blockquote className="mt-4 border-l-2 border-orange-400 pl-4 italic text-stone-400">
              &quot;A nest for ideas. A fire for your craft. A hut for all
              seasons.&quot;
            </blockquote>
            <p className="text-lg font-semibold text-orange-500">
              BukWarm is yours — to build, share, connect, and imagine.
            </p>
            <p>💬 Got an idea or tool? 💡 Want to collaborate or co-create?</p>
            <p>
              ✍️ Reach out. ✨ Contribute. ☕ Support us. 🔗 Be part of the
              nest.
            </p>
          </CardAction>
        </div>
      </div>
    </div>
  );
}
