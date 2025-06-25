// components/customUI/SuccessModal.jsx
import { useEffect, Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";

export function SuccessModal({
  isOpen,
  setIsOpen,
  message = "Changes saved!",
  duration = 2500, // ✅ allow external control
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-stone-800 border border-stone-700 rounded-xl px-6 py-4 shadow-xl text-center max-w-xs w-full">
              <DialogTitle className="text-white text-lg font-medium">
                ✅ {message}
              </DialogTitle>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
