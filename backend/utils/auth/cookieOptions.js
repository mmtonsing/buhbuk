// utils/cookieOptions.js
export const cookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 86400000,
};
