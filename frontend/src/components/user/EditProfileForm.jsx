import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser, updateUserDetails } from "@/api/users";
import { EmailVerifyModal } from "@/components/customUI/EmailVerifyModal";
import { toast } from "sonner";
import { validateUserForm } from "@/utils/validateUserForm";

export function EditProfileForm({ user, onSuccess }) {
  const { setUser: setAuthUser, refreshUser } = useAuth();
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const isPasswordMatch = form.newPassword === form.confirmPassword;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validateUserForm(form, {
      checkUsername: true,
      checkEmail: true,
      checkCurrentPassword: true,
      checkNewPassword: true,
    });

    if (error) {
      toast.error(`❌ ${error}`);
      return;
    }

    setLoading(true);
    const res = await updateUserDetails(form);
    setLoading(false);

    if (res.success) {
      const updated = await getCurrentUser();
      setAuthUser(updated);
      await refreshUser();
      onSuccess?.(form);
    } else {
      toast.error(`❌ ${res.message}`);
    }
  }

  return (
    <>
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md"
      >
        <Input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Current password (mandatory to save changes)"
          type="password"
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New password (optional)"
          type="password"
          className="bg-stone-700 text-white border-stone-600"
        />
        <Input
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          type="password"
          className="bg-stone-700 text-white border-stone-600"
        />
        {form.newPassword && (
          <p className="text-sm">
            {isPasswordMatch ? (
              <span className="text-green-500">✅ New Passwords match</span>
            ) : (
              <span className="text-red-500">
                ❌ New Passwords do not match
              </span>
            )}
          </p>
        )}
      </form>

      <EmailVerifyModal
        isOpen={showVerifyModal}
        setIsOpen={setShowVerifyModal}
      />
    </>
  );
}
