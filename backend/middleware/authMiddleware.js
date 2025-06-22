import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Token stored as cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY); // Verify token
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - Invalid token" });
  }
};

export default authMiddleware;
