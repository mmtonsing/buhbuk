import express from "express";
import * as users from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.route("/").get(authMiddleware, users.getAllUsers).post(users.createUser);

// Always keep the "/me" route above "/:id"
router.get("/me", authMiddleware, users.getUserInfo);

router.get("/:id/posts", users.getUserPosts);

router
  .route("/:id")
  .get(authMiddleware, users.retrieveUser)
  .put(authMiddleware, users.editUser)
  .delete(authMiddleware, users.deleteUser);

// Login and set HTTP-only cookie
router.post("/login", loginLimiter, users.loginUser);

// Logout - Clears cookie
router.post("/logout", authMiddleware, users.logoutUser);

export default router;
