// middleware/authVerifiedMiddleware.js
import authMiddleware from "./authMiddleware.js";

const authVerifiedMiddleware = async (req, res, next) => {
  // First run base auth (checks token + loads req.user)
  await authMiddleware(req, res, async (err) => {
    if (err) return; // base auth already handled response

    if (!req.user?.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    next(); // ✅ Auth + verified, proceed
  });
};

export default authVerifiedMiddleware;
