import { useState } from "react";
import { createUser } from "../../api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessModal } from "../customUI/SuccessModal";
import { toast } from "sonner";
import { validateUserForm } from "@/utils/validateUserForm";

export function CreateUser({ onSuccess }) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const isPasswordMatch = user.password === user.confirmPassword;

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validateUserForm(user, {
      checkUsername: true,
      checkEmail: true,
      checkPassword: true,
      checkConfirmPassword: true,
    });

    if (error) {
      toast.error(`❌ ${error}`);
      return;
    }

    const res = await createUser({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    if (res.success) {
      setShowSuccess(true);
      setUser({ username: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => onSuccess?.(), 3000);
    } else {
      toast.error(`❌ ${res.message}`);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <Input
          placeholder="Name"
          onChange={handleChange}
          name="username"
          required
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          placeholder="Email"
          onChange={handleChange}
          name="email"
          type="email"
          required
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          placeholder="Password"
          onChange={handleChange}
          name="password"
          type="password"
          required
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          placeholder="Confirm Password"
          onChange={handleChange}
          name="confirmPassword"
          value={user.confirmPassword}
          type="password"
          required
          className="bg-stone-700 text-white border-stone-600"
        />
        <p className="text-sm">
          {user.confirmPassword.length > 0 && (
            <span
              className={isPasswordMatch ? "text-green-500" : "text-red-500"}
            >
              {isPasswordMatch
                ? "✅ Passwords match"
                : "❌ Passwords do not match"}
            </span>
          )}
        </p>
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
          Create Account
        </Button>
      </form>

      <SuccessModal
        isOpen={showSuccess}
        setIsOpen={setShowSuccess}
        message="Account created. Please verify your email."
        duration={3000}
      />
    </>
  );
}
