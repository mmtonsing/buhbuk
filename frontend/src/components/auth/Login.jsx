import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser, verifyUser } from "../../api/users";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

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
      toast.success(`👋 Welcome back, ${res.username}!`);
      navigate(from, { replace: true });
    } else {
      toast.error(res.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <Input
        placeholder="Username or Email"
        onChange={handleChange}
        name="identifier"
        required
        maxLength={20}
        className="bg-stone-700 text-white border-stone-600"
      />
      <Input
        placeholder="Password"
        onChange={handleChange}
        name="password"
        type="password"
        required
        maxLength={20}
        className="bg-stone-700 text-white border-stone-600"
      />
      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
        Login
      </Button>
    </form>
  );
}
