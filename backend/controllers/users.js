import User from "../models/user.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import Mod3d from "../models/mod3d.js";

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

    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    res.status(200).json({ success: true, user: registeredUser });
  } catch (err) {
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
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      joinDate: user.joinDate,
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
      .populate("author", "username email")
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
