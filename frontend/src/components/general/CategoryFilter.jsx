// src/components/common/CategoryFilter.jsx
import { CATEGORY_LABELS } from "@/utils/constants";

export function CategoryFilter({ selected, onChange, categories = [] }) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`px-4 py-1.5 rounded-lg font-medium transition ${
            selected === cat
              ? "bg-amber-500 text-black"
              : "bg-stone-700 hover:bg-stone-600 text-white"
          }`}
          onClick={() => onChange(cat)}
        >
          {CATEGORY_LABELS?.[cat] || cat}
        </button>
      ))}
    </div>
  );
}
