import { useState } from "react";
import { updateUserDetails } from "@/api/usersApi";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { EmailVerifyModal } from "@/components/customUI/EmailVerifyModal";
import { Button } from "@/components/ui/button";
import { validateUserForm } from "@/utils/validateUserForm";
import { toast } from "sonner";

export function EditProfileForm({ user, onSuccess, onSubmit, onCancel }) {
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

    if (error) return toast.error(`❌ ${error}`);

    setLoading(true);
    const res = await updateUserDetails(form);
    setLoading(false);

    if (res.success) {
      await refreshUser();
      onSuccess?.(form);
      onSubmit?.();
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
        <div className="mt-6 flex justify-end gap-4">
          <Button
            form="edit-profile-form"
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Save Changes
          </Button>
          <Button
            onClick={onCancel}
            className="bg-stone-600 hover:bg-stone-500 text-white"
            type="button"
          >
            Cancel
          </Button>
        </div>
      </form>

      <EmailVerifyModal
        isOpen={showVerifyModal}
        setIsOpen={setShowVerifyModal}
      />
    </>
  );
}
