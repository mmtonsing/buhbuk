export default function Loader({
  message = "Loading BuhBuk...",
  size = "h-16 w-16",
  color = "border-blue-500 text-blue-600",
  overlay = false,
}) {
  const base = (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-transparent">
      <div
        className={`animate-spin rounded-full border-t-4 border-solid ${size} ${color}`}
      ></div>
      <p className={`mt-4 font-medium ${color.split(" ")[1]}`}>{message}</p>
    </div>
  );

  if (!overlay) return base;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50">
      {base}
    </div>
  );
}
