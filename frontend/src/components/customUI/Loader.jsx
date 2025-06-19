export default function Loader({
  message = "Loading BukWarm...",
  size = "h-16 w-16",
  color = "border-blue-500 text-blue-600",
}) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        className={`animate-spin rounded-full border-t-4 border-solid ${size} ${color}`}
      ></div>
      <p className={`mt-4 font-medium ${color.split(" ")[1]}`}>{message}</p>
    </div>
  );
}
