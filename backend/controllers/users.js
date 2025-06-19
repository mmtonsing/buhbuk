const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Mod3d = require("../models/mod3d");

//retrieve all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

//create a user
module.exports.createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const errors = [];

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) errors.push("Email");

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) errors.push("Username");

    // If either/both are taken
    if (errors.length > 0) {
      const message =
        errors.length === 2
          ? "Username and Email already in use"
          : `${errors[0]} already in use`;
      return res.status(400).json({ success: false, message });
    }

    // Register user
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    res.status(200).json({ success: true, user: registeredUser });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

//Retrieve a user
module.exports.retrieveUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

//Edit a user
module.exports.editUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body.user });
  await user.save();
  res.json(user);
};

//Delete a user
module.exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
};

// Login and set HTTP-only cookie
module.exports.loginUser = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: info?.message || "Login failed" });

      //generates JWT and
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
      console.log("NODE_ENV:", process.env.NODE_ENV);
      //stores it in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 12 * 60 * 60 * 1000, // 12 hours
      });
      return res.json({
        success: true,
        message: "Logged in successfully",
        username: user.username,
      });
    }
  )(req, res, next);
};

//logout Clears cookie
module.exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return res.json({ success: true, message: "Logged out successfully" });
};

//Gets user info from JWT (cookie)
module.exports.getUserInfo = (req, res) => {
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

module.exports.getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    // Simple ID format check (avoid CastError from Mongoose)
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        posts: [],
      });
    }

    const posts = await Mod3d.find({ author: id })
      .populate("author", "username email") // Populate username + email
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
      posts: [], // Always return posts array
    });
  }
};
