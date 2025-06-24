import User from "../models/userSchema.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import Mod3d from "../models/mod3dSchema.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email/sendVerificationEmail.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "✅Email already verified.",
        // return res.status(404).json({
        //   success: false,
        //   message: "Invalid or expired token",
      });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // console.log("✅ Email verified for user:", user._id);
    // res.redirect(`${process.env.CLIENT_URL}/verify-success`);
    res.json({ success: true, message: "✅ Email verified successfully!" });
  } catch (err) {
    console.error("🔥 Verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during verification",
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // find user
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

    // generate & save new token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationExpires = Date.now() + 10 * 60 * 1000; // 10min
    await user.save();

    // send it
    await sendVerificationEmail(email, token);

    res.json({ success: true, message: "Verification email resent" });
  } catch (err) {
    console.error("resendVerification error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to resend verification" });
  }
};

// Retrieve all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// Create a user
export const createUser = async (req, res) => {
  try {
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

    // ✅ Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // 1) Create & register
    const user = new User({
      username,
      email,
    });
    const registeredUser = await User.register(user, password);

    // 2) Now set your token fields *and save again*
    registeredUser.verificationToken = token;
    registeredUser.verificationExpires = Date.now() + 24 * 60 * 1000; // 10 minutes
    await registeredUser.save();
    // DEBUG: make sure they stuck
    // console.log("🛢️  Stored token on user:", {
    //   userId: registeredUser._id,
    //   token: registeredUser.verificationToken,
    //   expires: registeredUser.verificationExpires,
    // });

    // ✅ Send verification email
    await sendVerificationEmail(email, token);

    res.status(200).json({
      success: true,
      message: "Registration successful. Please check your email to verify.",
    });
  } catch (err) {
    // console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Retrieve a user
export const retrieveUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

// Edit a user
export const editUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body.user });
  await user.save();
  res.json(user);
};

// Delete a user
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
};

// Login and set HTTP-only cookie
export const loginUser = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);

      if (!user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: "Please verify your email before logging in.",
        });
      }

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: info?.message || "Login failed" });

      const token = jwt.sign(
        {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          joinDate: user.joinDate,
          profilePic: user.profilePic,
        },
        process.env.SECRETKEY,
        { expiresIn: "12h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 12 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Logged in successfully",
        username: user.username,
      });
    }
  )(req, res, next);
};

// Logout: Clear cookie
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return res.json({ success: true, message: "Logged out successfully" });
};

// Get user info from JWT (cookie)
export const getUserInfo = (req, res) => {
  try {
    const user = req.user;
    // console.log("User info:", user);
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      joinDate: user.joinDate,
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a user's Mod3d posts
export const getUserPosts = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    console.error("getUserPosts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve posts",
      posts: [],
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profilePic: newKey } = req.body;
    if (!newKey) {
      return res
        .status(400)
        .json({ success: false, message: "Missing profilePic key" });
    }

    // 1) Load the current user so we know their old key
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const oldKey = user.profilePic;
    // 2) If they had one, delete it from S3
    if (oldKey) {
      try {
        await deleteFileFromS3(oldKey);
      } catch (err) {
        console.warn("Failed to delete old profile pic:", err);
        // still proceed but can  bail here if prefer
      }
    }

    // 3) Update the user document with the new key
    user.profilePic = newKey;
    const updated = await user.save();

    // 4) Re-sign their JWT so the cookie stays up to date
    const token = jwt.sign(
      {
        id: updated._id.toString(),
        username: updated.username,
        email: updated.email,
        joinDate: updated.joinDate,
        profilePic: updated.profilePic,
      },
      process.env.SECRETKEY,
      { expiresIn: "12h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    // 5) Return success
    res.status(200).json({ success: true, profilePic: updated.profilePic });
  } catch (err) {
    console.error("updateProfilePic error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile picture" });
  }
};
