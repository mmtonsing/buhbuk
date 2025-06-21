// components/customUI/ComingSoonModal.jsx
export function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-stone-800 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-md border border-stone-600">
        <h2 className="text-2xl font-semibold text-amber-400 mb-2">
          Coming Soon
        </h2>
        <p className="text-stone-300 mb-4">
          Interactive 3D viewer is under development. Stay tuned!
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
