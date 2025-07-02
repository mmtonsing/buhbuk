import { useNavigate } from "react-router-dom";

export function VarietyRedirectButton({ label, to, onClick }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(to);
        onClick?.();
      }}
      className="text-left w-full px-3 py-2 text-sm rounded-md hover:bg-[#3b2a26] transition"
    >
      {label}
    </button>
  );
}
