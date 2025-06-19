// components/customUI/SkeletonCard.jsx
export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-muted p-4 shadow-sm space-y-4">
      <div className="h-40 bg-gray-300 rounded-md" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
    </div>
  );
}
