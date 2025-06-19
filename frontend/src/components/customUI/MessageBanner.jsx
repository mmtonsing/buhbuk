import { useEffect } from "react";
import { X } from "lucide-react";

export function MessageBanner({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseColor =
    type === "success"
      ? "bg-green-600 border-green-400"
      : type === "error"
      ? "bg-red-600 border-red-400"
      : type === "info"
      ? "bg-blue-600 border-blue-400"
      : "bg-stone-700 border-stone-500";

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl border text-white flex items-center justify-between gap-4 min-w-[320px] max-w-[90%] ${baseColor} backdrop-blur-sm transition-all duration-300`}
    >
      <span className="text-base font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto hover:opacity-75 transition-opacity"
        aria-label="Close message"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
