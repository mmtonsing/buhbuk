import { UserBadge } from "@/pages/user/UserBadge";

export function PublicCard({ mod3d }) {
  return (
    <div className="rounded-xl bg-stone-800 hover:bg-stone-700 transition shadow-md border border-stone-700 overflow-hidden">
      {mod3d.imageId ? (
        <img
          src={mod3d.image}
          alt={mod3d.title}
          className="w-full h-56 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-56 bg-stone-700 flex items-center justify-center text-stone-400">
          No Image
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-stone-100">{mod3d.title}</h3>
        <p className="text-sm text-stone-400 mt-1">
          {mod3d.author && <UserBadge user={mod3d.author} />}
        </p>
      </div>
    </div>
  );
}
