import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

export default function EmailVerify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();
  const didVerify = useRef(false);

  useEffect(() => {
    if (didVerify.current) return; // guard against the second invocation
    didVerify.current = true;
    async function verify() {
      try {
        const res = await axiosInstance.get(`/user/verify/${token}`);
        setMessage(res.data.message || "✅ Email verified, You can now login.");
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
        navigate("/auth");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, navigate]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-semibold">{message}</h1>
    </div>
  );
}

// setTimeout(() => {
//   navigate("/auth", { state: { message: "✅ Email verified!" } });
// }, 3000);
