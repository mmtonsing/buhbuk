import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { CreateUser } from "@/components/auth/CreateUser";
import { Login } from "@/components/auth/Login";
import { Button } from "@/components/ui/button";
import { MessageBanner } from "@/components/customUI/MessageBanner";
import { PageTitle, PageParagraph } from "@/components/customUI/Typography";

export function Landing() {
  const [view, setView] = useState(0); // 0 = login, 1 = create account
  const [successEmail, setSuccessEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();

  // Show redirect message
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setShowMessage(true);
      window.history.replaceState({}, document.title); // clear state
    }
  }, [location.state]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center w-screen h-auto bg-stone-900 text-stone-100 py-10 px-4">
      {showMessage && (
        <MessageBanner
          message={message}
          type="error"
          onClose={() => setShowMessage(false)}
        />
      )}

      <div className="flex flex-col w-full max-w-lg rounded-xl p-6 bg-stone-800 shadow-lg space-y-4">
        <PageTitle className="text-amber-300 text-center text-3xl">
          {view ? "Create Account" : "Login to BuhBuk"}
        </PageTitle>

        {!view ? (
          <>
            <Login prefillIdentifier={successEmail} />
            <Button
              variant="ghost"
              onClick={() => setView(1)}
              className="text-sm text-stone-300 hover:text-[#47211f] hover:bg-stone-300"
            >
              Create new account
            </Button>
          </>
        ) : (
          <>
            <CreateUser
              onSuccess={(email) => {
                setSuccessEmail(email);
                setView(0);
              }}
            />
            <Button
              variant="ghost"
              onClick={() => setView(0)}
              className="text-sm text-stone-300 hover:text-[#47211f] hover:bg-stone-300"
            >
              Login existing account
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
