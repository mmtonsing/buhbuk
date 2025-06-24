import { useState } from "react";
import { createUser } from "../../api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CreateUser({ onSuccess }) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    const updatedUser = { ...user, [name]: value };
    setUser(updatedUser);

    if (
      (name === "password" || name === "confirmPassword") &&
      updatedUser.confirmPassword &&
      updatedUser.password === updatedUser.confirmPassword
    ) {
      setError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await createUser({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    if (res.success) {
      toast.success("✅ Account created. Check your email to verify!");
      setUser({ username: "", email: "", password: "", confirmPassword: "" });
      if (onSuccess) onSuccess(); // Switch to login screen
    } else {
      toast.error(`❌ ${res.message}`);
    }
  }

  const isPasswordMatch = user.password === user.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <Input
        placeholder="Name"
        onChange={handleChange}
        name="username"
        required
        minLength={6}
        maxLength={30}
        className="bg-stone-700 text-white border-stone-600"
      />
      <Input
        placeholder="Email"
        onChange={handleChange}
        name="email"
        type="email"
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
      <Input
        placeholder="Confirm Password"
        onChange={handleChange}
        name="confirmPassword"
        value={user.confirmPassword}
        type="password"
        required
        minLength={6}
        maxLength={20}
        className="bg-stone-700 text-white border-stone-600"
      />
      <p className="text-sm">
        {error ? (
          <span className="text-red-500">❌ {error}</span>
        ) : user.confirmPassword.length > 0 ? (
          <span className={isPasswordMatch ? "text-green-500" : "text-red-500"}>
            {isPasswordMatch
              ? "✅ Passwords match"
              : "❌ Passwords do not match"}
          </span>
        ) : null}
      </p>
      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
        Create Account
      </Button>
    </form>
  );
}
