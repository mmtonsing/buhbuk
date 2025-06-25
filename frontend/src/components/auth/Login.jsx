import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import {
  getCurrentUser,
  verifyUser,
  resendVerification,
} from "../../api/users";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  // — NEW: track whether they need a resend link —
  const [canResend, setCanResend] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const from = location.state?.from || "/";

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await verifyUser(formData);

    if (res.success) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      toast.success(`👋 Welcome, ${res.username}!`);
      navigate(from, { replace: true });
      return;
    }
    // if they haven’t verified yet, offer the resend button
    if (res.message?.includes("verify your email")) {
      setCanResend(true);
    }
    toast.error(res.message || "Login failed");
  }

  // — NEW handler to actually send them a new link —
  async function handleResend() {
    const { success, message } = await resendVerification(formData.identifier);
    setResendMsg(message);
    if (success) setCanResend(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <Input
        placeholder="Username or Email"
        onChange={handleChange}
        name="identifier"
        required
        minLength={6}
        maxLength={64}
        className="bg-stone-700 text-white border-stone-600"
      />
      <Input
        placeholder="Password"
        onChange={handleChange}
        name="password"
        type="password"
        required
        minLength={6}
        maxLength={20}
        className="bg-stone-700 text-white border-stone-600"
      />
      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
        Login
      </Button>

      {/* resendsection */}
      {canResend && (
        <div className="mt-2 text-sm">
          <button
            type="button"
            onClick={handleResend}
            className="underline text-blue-400 hover:text-blue-600"
          >
            Resend verification email
          </button>
          {resendMsg && <p className="mt-1 text-xs">{resendMsg}</p>}
        </div>
      )}
    </form>
  );
}
