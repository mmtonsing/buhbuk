//#region imports
import passport from "passport";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/userSchema.js";
import Mod3d from "../models/mod3dSchema.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";
import { setAuthCookie } from "../utils/auth/setAuthCookie.js";
import { sendVerificationEmail } from "../services/email/sendVerificationEmail.js";
import { getVerificationExpiryTime } from "../utils/timeUtils.js";
import { successRes, errorRes } from "../utils/responseHelper.js";
import { resolveUserUrls } from "../utils/resolveUserUrls.js";
//#endregion

//#region Authentication
export const loginUser = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    asyncHandler(async (err, user, info) => {
      if (err) return next(err);
      if (!user) return errorRes(res, info?.message || "Login failed", 400);
      if (!user.emailVerified) {
        return errorRes(
          res,
          "Please verify your email before logging in.",
          400
        );
      }

      setAuthCookie(res, user);
      return successRes(
        res,
        { username: user.username },
        "Logged in successfully"
      );
    })
  )(req, res, next);
};

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return successRes(res, {}, "Logged out successfully");
});
//#endregion

//#region Email Verification
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: new Date() }, //
  });

  if (!user) return errorRes(res, "Invalid or expired verification token", 400);

  user.emailVerified = true;
  user.wasEverVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();

  setAuthCookie(res, user);
  return successRes(res, {}, "✅ Email verified successfully!");
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return errorRes(res, "Email is required", 400);

  const user = await User.findOne({ email });
  if (!user) return errorRes(res, "No account with that email", 404);
  if (user.emailVerified) return errorRes(res, "Email already verified", 400);

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationExpires = getVerificationExpiryTime();
  await user.save();

  await sendVerificationEmail(email, token);
  return successRes(res, {}, "Verification email resent");
});
//#endregion

//#region User CRUD
export const createUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  const errors = [];

  const existingEmail = await User.findOne({ email });
  if (existingEmail) errors.push("Email");
  const existingUsername = await User.findOne({ username });
  if (existingUsername) errors.push("Username");

  if (errors.length > 0) {
    const message =
      errors.length === 2
        ? "Username and Email already in use"
        : `${errors[0]} already in use`;
    return errorRes(res, message, 400);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const user = new User({ username, email });
  const registeredUser = await User.register(user, password);
  registeredUser.verificationToken = token;
  registeredUser.verificationExpires = getVerificationExpiryTime();
  registeredUser.verificationStartedAt = new Date();
  await registeredUser.save();

  await sendVerificationEmail(email, token);
  return successRes(
    res,
    {},
    "Registration successful. Please check your email to verify."
  );
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { username, email, currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) return errorRes(res, "User not found", 404);

  // 🛑 Require currentPassword for any change
  if (!currentPassword)
    return errorRes(res, "Current password is required", 400);

  const isValid = await user.authenticate(currentPassword);
  if (!isValid.user) return errorRes(res, "Incorrect current password", 400);

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return errorRes(res, "Username already taken", 400);
    user.username = username;
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return errorRes(res, "Email already in use", 400);

    user.email = email;
    user.emailVerified = false;
    user.verificationExpires = undefined;

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationStartedAt = new Date();

    await sendVerificationEmail(email, token);
  }

  // ✅ Update password if requested
  if (newPassword) {
    await user.setPassword(newPassword);
  }

  await user.save();
  setAuthCookie(res, user);
  return successRes(res, {}, "Profile updated successfully");
});

export const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "username email createdAt profilePic emailVerified"
  );
  if (!user) return errorRes(res, "User not found", 404);

  const enriched = resolveUserUrls(user);

  return successRes(res, {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    profilePic: user.profilePic,
    emailVerified: user.emailVerified,
    profilePicUrl: enriched.profilePicUrl,
  });
});
//#endregion

//#region User specifics
export const getUserPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || id.length !== 24) return errorRes(res, "Invalid user ID", 400);

  const posts = await Mod3d.find({ author: id })
    .populate("author", "username email profilePic")
    .sort({ dateCreated: -1 });

  const enriched = posts.map((post) => ({
    ...post.toObject(),
    author: resolveUserUrls(post.author),
  }));
  return successRes(res, { posts: enriched });
});

export const updateProfilePic = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { profilePic: newKey } = req.body;

  if (!newKey) return errorRes(res, "Missing profilePic key", 400);

  const user = await User.findById(userId);
  if (!user) return errorRes(res, "User not found", 404);

  const oldKey = user.profilePic;
  if (oldKey) {
    try {
      await deleteFileFromS3(oldKey);
    } catch (err) {
      console.warn("⚠️ Failed to delete old profile pic:", err);
    }
  }

  user.profilePic = newKey;
  await user.save();
  setAuthCookie(res, user);

  const enriched = resolveUserUrls(user);
  return successRes(res, {
    profilePic: user.profilePic,
    profilePicUrl: enriched.profilePicUrl,
  });
});
//#endregion

//#region Not used yet
// export const retrieveUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) return errorRes(res, "User not found", 404);

//   const enriched = resolveUserUrls(user);
//   return successRes(res, { user: enriched });
// });

// export const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   return successRes(res, { user });
// });

// export const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   const enrichedUsers = users.map(resolveUserUrls);
//   return successRes(res, { users: enrichedUsers });
// });
//#endregion
