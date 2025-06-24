// components/customUI/InfoTooltip.jsx
import { useState } from "react";

export function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block ml-2">
      <button
        type="button"
        className="text-blue-300 hover:text-blue-400 focus:outline-none text-sm"
        onClick={() => setShow(!show)}
      >
        ℹ️
      </button>
      {show && (
        <div className="absolute z-10 top-6 left-0 bg-stone-800 text-sm text-stone-100 border border-stone-600 p-2 rounded-md w-64 shadow-lg">
          {text}
        </div>
      )}
    </span>
  );
}
