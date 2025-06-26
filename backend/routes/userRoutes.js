import express from "express";
import * as users from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginLimiter, verificationLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.route("/").get(authMiddleware, users.getAllUsers).post(users.createUser);

// right after your createUser POST…
router.post("/resend-verify", verificationLimiter, users.resendVerification);

// Always keep the "/me" route above "/:id"
router.get("/me", authMiddleware, users.getUserInfo);

//profilepic
router.put("/profile-pic", authMiddleware, users.updateProfilePic);

router.get("/verify/:token", verificationLimiter, users.verifyEmail);

// router.get("/:id/posts", users.getUserPosts);

router
  .route("/:id")
  .get(authMiddleware, users.retrieveUser)
  .put(authMiddleware, users.updateUserDetails)
  .delete(authMiddleware, users.deleteUser);

// Login and set HTTP-only cookie
router.post("/login", loginLimiter, users.loginUser);

// Logout - Clears cookie
router.post("/logout", authMiddleware, users.logoutUser);

export default router;
