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
//#endregion

//#region Authentication
export const loginUser = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    asyncHandler(async (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: info?.message || "Login failed" });

      if (!user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: "Please verify your email before logging in.",
        });
      }

      setAuthCookie(res, user);

      res.json({
        success: true,
        message: "Logged in successfully",
        username: user.username,
      });
    })
  )(req, res, next);
};

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
});
//#endregion

//#region Email Verification
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "✅Email already verified.",
    });
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();
  setAuthCookie(res, user);
  res.json({ success: true, message: "✅ Email verified successfully!" });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "No account with that email" });
  }
  if (user.emailVerified) {
    return res
      .status(400)
      .json({ success: false, message: "Email already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationExpires = getVerificationExpiryTime();

  await user.save();
  await sendVerificationEmail(email, token);
  res.json({ success: true, message: "Verification email resent" });
});
//#endregion

//#region user CRUD
export const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, email, currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }
    user.username = username;
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    user.email = email;
    user.emailVerified = false;
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    await sendVerificationEmail(email, token);
  }

  if (currentPassword && newPassword) {
    const isValid = await user.authenticate(currentPassword);
    if (!isValid.user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }
    await user.setPassword(newPassword);
  }

  await user.save();
  setAuthCookie(res, user);
  res.json({ success: true, message: "Profile updated successfully" });
});

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
    return res.status(400).json({ success: false, message });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const user = new User({ username, email });
  const registeredUser = await User.register(user, password);
  registeredUser.verificationToken = token;
  registeredUser.verificationExpires = getVerificationExpiryTime();
  registeredUser.verificationStartedAt = new Date();
  await registeredUser.save();
  await sendVerificationEmail(email, token);
  res.status(200).json({
    success: true,
    message: "Registration successful. Please check your email to verify.",
  });
});

export const getUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    joinDate: user.joinDate,
    profilePic: user.profilePic,
    emailVerified: user.emailVerified,
  });
});

export const retrieveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
//#endregion

//#region user specifics
export const getUserPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      posts: [],
    });
  }
  const posts = await Mod3d.find({ author: id })
    .populate("author", "username email profilePic")
    .sort({ dateCreated: -1 });
  res.status(200).json({ success: true, posts });
});

export const updateProfilePic = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { profilePic: newKey } = req.body;
  if (!newKey) {
    return res
      .status(400)
      .json({ success: false, message: "Missing profilePic key" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const oldKey = user.profilePic;
  if (oldKey) {
    try {
      await deleteFileFromS3(oldKey);
    } catch (err) {
      console.warn("Failed to delete old profile pic:", err);
    }
  }
  user.profilePic = newKey;
  const updated = await user.save();
  setAuthCookie(res, updated);
  res.status(200).json({ success: true, profilePic: updated.profilePic });
});
//#endregion
