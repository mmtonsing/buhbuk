// utils/signUserToken.js
import jwt from "jsonwebtoken";

export function signUserToken(user) {
  return jwt.sign(
    { id: user._id.toString() }, // ✅ minimal
    process.env.SECRETKEY,
    { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
  );
}
