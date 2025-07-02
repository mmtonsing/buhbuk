// src/components/customUI/Typography.jsx
import React from "react";
import clsx from "clsx";

// clsx is a utility for conditionally joining classNames together.
// It helps concatenate Tailwind or other CSS classes cleanly.

export function PageTitle({ children, className = "" }) {
  return (
    <h1
      className={clsx(
        "font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-stone-100 drop-shadow-md",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function PageSubtitle({ children, className = "" }) {
  return (
    <h2
      className={clsx(
        "font-serif text-lg sm:text-xl font-semibold text-amber-200 italic text-center mt-2 tracking-wide",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function PageParagraph({ children, className = "" }) {
  return (
    <p
      className={clsx(
        "text-[0.95rem] sm:text-lg leading-relaxed text-stone-300 text-center mb-2",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ children, className = "" }) {
  return (
    <h2
      className={clsx(
        "font-serif text-2xl sm:text-3xl font-bold text-amber-300 mb-6",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function SmallText({ children, className = "" }) {
  return (
    <p
      className={clsx(
        "text-xs sm:text-sm text-stone-400 text-center",
        className
      )}
    >
      {children}
    </p>
  );
}
