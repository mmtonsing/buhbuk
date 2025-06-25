//#region Imports
import asyncHandler from "express-async-handler";
import Post from "../models/postSchema.js";
//#endregion

//#region 📤 Create Post
export const createPost = asyncHandler(async (req, res) => {
  const { category, refId } = req.body;

  const post = await Post.create({
    category,
    refId,
    author: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});
//#endregion

//#region 🔍 Public Posts (Preview & Feed)
export const getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .populate("author", "username profilePic")
    .populate("refId") // load the actual post content
    .limit(10); // return only a preview list

  res.status(200).json({ message: "Fetched posts", data: posts });
});

export const getPaginatedPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  const total = await Post.countDocuments({ isPublic: true });

  const posts = await Post.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username profilePic")
    .populate("refId");

  res.status(200).json({
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  });
});
//#endregion

//#region 📄 Get Single Post
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username profilePic")
    .populate("refId");
  console.log(post);
  if (!post) return res.status(404).json({ error: "Post not found" });

  res.json(post);
});
//#endregion

//#region 👤 Get posts by logged-in user
export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id }).populate(
    "author profilePic"
  );
  res.json({
    data: posts,
  });
});
//#endregion

//#region 🗑️ Delete Post
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post || post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized or post not found" });
  }

  res.json({
    success: true,
    message: "Post deleted successfully",
  });
});
//#endregion
