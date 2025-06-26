import express from "express";
import {
  getPublicPosts,
  createPost,
  getMyPosts,
  deletePost,
  getPost,
  getPostsByUser,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPaginatedPosts } from "../controllers/postController.js";

const router = express.Router();

router.get("/public", getPublicPosts); // public feed
router.get("/feed", getPaginatedPosts);
router.get("/user/me", authMiddleware, getMyPosts); // dashboard
router.get("/user/:id", getPostsByUser);

router.post("/", authMiddleware, createPost); // auto-create post
// routes/posts.js
router.get("/:id", getPost);

router.delete("/:id", authMiddleware, deletePost); // remove post

export default router;
