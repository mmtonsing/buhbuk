import { useEffect, Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";

export function SuccessModal({
  isOpen,
  setIsOpen,
  message = "Changes saved!",
  duration = 2500,
  onClose,
  buttonText = null, // pass "Go to Login Now" to show a button
}) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setIsOpen(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose, setIsOpen]);

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
            <div className="bg-stone-800 border border-stone-700 rounded-xl px-6 py-5 shadow-xl text-center max-w-md w-full space-y-4">
              <DialogTitle className="text-white text-lg font-medium whitespace-pre-line">
                ✅ {message}
              </DialogTitle>

              {buttonText && (
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {buttonText}
                </Button>
              )}
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
