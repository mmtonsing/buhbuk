// utils/validateUserForm.js
export function validateUserForm(data, options = {}) {
  const {
    username,
    email,
    password,
    confirmPassword,
    currentPassword,
    newPassword,
  } = data;

  if (options.checkUsername) {
    if (!username || username.length < 6 || username.length > 30) {
      return "Username must be between 6 and 30 characters";
    }
  }

  if (options.checkEmail) {
    if (!email || email.length < 6 || email.length > 64) {
      return "Email must be between 6 and 64 characters";
    }
  }

  if (options.checkPassword) {
    if (!password || password.length < 6 || password.length > 20) {
      return "Password must be between 6 and 20 characters";
    }
  }

  if (options.checkNewPassword) {
    if (newPassword && (newPassword.length < 6 || newPassword.length > 20)) {
      return "New password must be between 6 and 20 characters";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }
  }

  if (options.checkConfirmPassword && password !== confirmPassword) {
    return "Passwords do not match";
  }

  if (options.checkCurrentPassword) {
    if (!currentPassword || currentPassword.length < 6) {
      return "Current password is required and must be at least 6 characters";
    }
  }

  return null; // ✅ All good
}
