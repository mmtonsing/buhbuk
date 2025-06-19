// src/components/ui/LoadingMessage.jsx
export function LoadingMessage({ text = "Loading…" }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <p className="text-center mt-10 text-lg">{text}</p>
    </div>
  );
}
