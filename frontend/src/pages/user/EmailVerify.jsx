import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

export default function EmailVerify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();
  const didVerify = useRef(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (didVerify.current) return; // guard against the second invocation
    didVerify.current = true;
    async function verify() {
      try {
        const res = await axiosInstance.get(`/user/verify/${token}`);
        setMessage(res.data.message || "✅ Email verified, You can now login.");
        await refreshUser();
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "❌ Verification failed. Link may have expired.";
        setMessage(msg);
      }
    }

    verify();
  }, [token]);

  useEffect(() => {
    if (message.startsWith("✅")) {
      const timeout = setTimeout(() => {
        navigate("/profile"); // or navigate("/auth"); if you want login page
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [message, navigate]);

  return (
    <div className="p-4 text-center text-white h-screen w-full bg-stone-900 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
}

// setTimeout(() => {
//   navigate("/auth", { state: { message: "✅ Email verified!" } });
// }, 3000);
