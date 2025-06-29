import { useNavigate } from "react-router-dom";

export function ExploreRedirectButton({ label, to, onClick }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(to);
        onClick?.();
      }}
      className="w-full text-left px-3 py-2 text-sm hover:bg-stone-700 rounded-md"
    >
      {label}
    </button>
  );
}
