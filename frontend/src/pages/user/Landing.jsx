import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { CreateUser } from "@/components/auth/CreateUser";
import { Login } from "@/components/auth/Login";
import { Button } from "@/components/ui/button";
import { MessageBanner } from "@/components/customUI/MessageBanner";

export function Landing() {
  const [view, setView] = useState(0); //0-login 1-create
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();

  // ✅ Show message on redirect with state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setShowMessage(true);

      // Clear state to prevent it from showing again on refresh/back
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center w-screen h-auto bg-stone-900 text-stone-100">
      {/* ✅ Message banner */}
      {showMessage && (
        <MessageBanner
          message={message}
          type="error"
          onClose={() => setShowMessage(false)}
        />
      )}

      <div className="flex flex-col w-full max-w-sm rounded-xl p-6 bg-stone-800 shadow-lg space-y-4">
        {!view ? (
          <>
            <Login />
            <Button
              variant="ghost"
              onClick={() => setView(1)}
              className="text-sm text-stone-300 hover:text-white"
            >
              Create new account
            </Button>
          </>
        ) : (
          <>
            <CreateUser onSuccess={() => setView(0)} />
            <Button
              variant="ghost"
              onClick={() => setView(0)}
              className="text-sm text-stone-300 hover:text-white"
            >
              Login existing account
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
