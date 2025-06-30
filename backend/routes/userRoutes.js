import express from "express";
import * as users from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginLimiter, verificationLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router
  .route("/")
  // .get(authMiddleware, users.getAllUsers)
  .post(users.createUser);

router.post("/resend-verify", verificationLimiter, users.resendVerification);

router.get("/me", authMiddleware, users.getUserInfo);

//profilepic
router.put("/profile-pic", authMiddleware, users.updateProfilePic);

router.get("/verify/:token", verificationLimiter, users.verifyEmail);

router
  .route("/:id")
  // .get(authMiddleware, users.retrieveUser)
  .put(authMiddleware, users.updateUserDetails);
// .delete(authMiddleware, users.deleteUser);

router.post("/login", loginLimiter, users.loginUser);
router.post("/logout", authMiddleware, users.logoutUser);

export default router;
