import express from "express";
import {
  getPublicPosts,
  getMyPosts,
  getPostsByUser,
} from "../controllers/postController.js";
import * as likes from "../controllers/likeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicPosts); // public feed
router.get("/user/me", authMiddleware, getMyPosts); // dashboard
router.get("/user/:id", getPostsByUser);
router.post("/:id/like", authMiddleware, likes.toggleLike);

export default router;
