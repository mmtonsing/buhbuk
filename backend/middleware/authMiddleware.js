import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    const user = await User.findById(decoded.id).select(
      "_id username email profilePic emailVerified"
    ); // ✅ latest info

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // ✅ Full user info for routes

    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - Invalid token" });
  }
};

export default authMiddleware;
