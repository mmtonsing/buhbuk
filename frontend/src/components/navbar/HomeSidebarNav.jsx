import { useEffect, useState } from "react";

const sections = [
  { id: "welcome", label: "Welcome" },
  { id: "3d", label: "3D Models" },
  { id: "blogs", label: "Blogs" },
  { id: "features", label: "Features" },
];

export function HomeSidebarNav() {
  const [active, setActive] = useState("welcome");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5
          )
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const topMost = visibleEntries[0];
          setActive(topMost.target.id);
        }
      },
      {
        threshold: [0.4, 0.5, 1.0], // observe when 50%+, 75%+ or 100% visible
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // adjust for your navbar height in pixels (e.g. 6rem = 96px) 5rem=mt-20=80px
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Vertical sidebar for large screens */}
      <nav className="hidden xl:flex fixed top-20 left-0 z-40 flex-col gap-3 bg-stone-800 p-2 pl-3 pr-1 rounded-r-md shadow-md">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(id);
              const el = document.getElementById(id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActive(id); // immediately update
              }
            }}
            onMouseEnter={() => scrollToSection(id)}
            className={`text-left text-sm px-3 py-1 rounded transition hover:bg-stone-700 ${
              active === id
                ? "bg-stone-700 text-white font-semibold"
                : "text-stone-300"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Topbar for smaller screens */}
      <nav className="xl:hidden fixed mx-auto top-20 left-0 right-0 z-40 flex flex-wrap justify-center bg-stone-900 px-2 py-1 gap-2 shadow-md border-b border-stone-700 ">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(id);
              const el = document.getElementById(id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActive(id); // immediately update
              }
            }}
            onMouseEnter={() => scrollToSection(id)}
            className={`text-center px-2 py-1 rounded transition hover:bg-stone-700 text-xs sm:text-sm md:text-base
              ${
                active === id
                  ? "bg-stone-700 text-white font-semibold"
                  : "text-stone-300"
              }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}

// max - w - screen - sm;
