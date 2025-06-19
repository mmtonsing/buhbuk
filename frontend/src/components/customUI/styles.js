// src/components/ui/styles/uiStyles.ts
import { tv } from "tailwind-variants";

// For consistent spacing in sections
export const sectionWrapper = tv({
  base: "w-full max-w-7xl mx-auto px-4",
});

// For reusable grid layout
export const gridLayout = tv({
  base: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6",
});

// For feature or card blocks
export const card = tv({
  base: "bg-stone-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition",
});

// For navbar buttons
export const navButton = tv({
  base: "px-4 py-2 rounded-md text-white transition m-2",
  variants: {
    intent: {
      login: "bg-green-600 hover:bg-green-700",
      logout: "bg-red-700 hover:bg-red-800",
    },
  },
  defaultVariants: {
    intent: "login",
  },
});
