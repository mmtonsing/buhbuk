import { useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export function EmailVerifyModal({ isOpen, setIsOpen }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 3000); // ⏱ 3s delay
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-stone-800 border border-stone-700 rounded-xl px-6 py-4 shadow-xl max-w-sm w-full text-center">
              <Dialog.Title className="text-lg font-semibold text-white">
                📩 Verify Your New Email
              </Dialog.Title>
              <p className="text-stone-300 mt-2 text-sm">
                Please check your inbox to verify your updated email address.
              </p>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
