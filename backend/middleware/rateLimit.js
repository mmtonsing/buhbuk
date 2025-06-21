import rateLimit from "express-rate-limit";

// Global limiter (e.g., for DDoS protection)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: "Too many requests, please try again later.",
});

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginLimiter, globalLimiter };
