//#region Imports
import asyncHandler from "express-async-handler";
import Post from "../models/postSchema.js";
import { successRes, errorRes } from "../utils/responseHelper.js";
import { resolveMediaUrls } from "../utils/resolveMediaUrls.js";
import { resolveUserUrls } from "../utils/resolveUserUrls.js";
//#endregion

//#region 📤 Create Post
export const createPost = asyncHandler(async (req, res) => {
  const { category, refId } = req.body;

  if (!category || !refId) {
    return errorRes(res, "Missing category or refId", 400);
  }

  const post = await Post.create({
    category,
    refId,
    author: req.user._id,
  });

  return successRes(res, post, "Post created successfully");
});
//#endregion

//#region 🔍 Public Posts (Preview & Feed)
export const getPublicPosts = asyncHandler(async (req, res) => {
  const { category, tag, sort = "latest", limit } = req.query;

  const filter = { isPublic: true };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;

  let query = Post.find(filter)
    .populate("author", "username profilePic")
    .populate({ path: "refId", select: "-__v" });

  const parsedLimit = parseInt(limit, 10);
  if (!isNaN(parsedLimit)) {
    query = query.limit(parsedLimit);
  }

  let posts = await query;

  const validPosts = posts
    .filter((post) => post.refId)
    .map((post) => {
      const enriched = resolveMediaUrls(post.refId);
      const enrichedAuthor = resolveUserUrls(post.author);
      return {
        ...post.toObject(),
        author: enrichedAuthor,
        refId: enriched,
        imageUrl: enriched.imageUrl || null,
        videoUrl: enriched.videoUrl || null,
      };
    });

  // Sorting (same as before)
  if (sort === "trending") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    validPosts.sort((a, b) => {
      const aRecent = new Date(a.createdAt) > oneWeekAgo;
      const bRecent = new Date(b.createdAt) > oneWeekAgo;
      const aScore = (a.likedBy?.length || 0) + (aRecent ? 5 : 0);
      const bScore = (b.likedBy?.length || 0) + (bRecent ? 5 : 0);
      return bScore - aScore;
    });
  } else {
    validPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return successRes(res, { posts: validPosts }, "Fetched public posts");
});

//not used yet
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

  const enrichedPosts = posts.map((post) => {
    const enriched = resolveMediaUrls(post.refId);
    const enrichedAuthor = resolveUserUrls(post.author);
    return {
      ...post.toObject(),
      author: enrichedAuthor,
      refId: enriched,
      imageUrl: enriched.imageUrl || null,
      videoUrl: enriched.videoUrl || null,
    };
  });

  return successRes(
    res,
    {
      posts: enrichedPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    },
    "Fetched paginated posts"
  );
});
//#endregion

//#region 📄 Get Posts By User
export const getPostsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id.length !== 24) {
    return errorRes(res, "Invalid user ID", 400);
  }

  const posts = await Post.find({ author: id })
    .sort({ createdAt: -1 })
    .populate("author", "username emailVerified email profilePic")
    .populate("refId");

  const enrichedPosts = posts.map((post) => {
    const enriched = resolveMediaUrls(post.refId);
    const enrichedAuthor = resolveUserUrls(post.author);
    return {
      ...post.toObject(),
      author: enrichedAuthor,
      refId: enriched,
      imageUrl: enriched.imageUrl || null,
      videoUrl: enriched.videoUrl || null,
    };
  });
  return successRes(res, { posts: enrichedPosts }, "Fetched your posts");
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username profilePic")
    .populate("refId");

  if (!post) return errorRes(res, "Post not found", 404);

  const enriched = resolveMediaUrls(post.refId);
  const enrichedAuthor = resolveUserUrls(post.author);

  return successRes(
    res,
    {
      ...post.toObject(),
      author: enrichedAuthor,
      refId: enriched,
      imageUrl: enriched.imageUrl || null,
      videoUrl: enriched.videoUrl || null,
    },
    "Fetched post"
  );
});
//#endregion

//#region 👤 Get My Posts
export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate("author", "username profilePic")
    .populate("refId");

  const enrichedPosts = posts
    .filter((post) => post.refId)
    .map((post) => {
      const enriched = resolveMediaUrls(post.refId);
      const enrichedAuthor = resolveUserUrls(post.author);
      return {
        ...post.toObject(),
        author: enrichedAuthor,
        refId: enriched,
        imageUrl: enriched.imageUrl || null,
        videoUrl: enriched.videoUrl || null,
      };
    });
  return successRes(res, { posts: enrichedPosts }, "Fetched your posts");
});
//#endregion

//#region 🗑️ Delete Post
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) return errorRes(res, "Post not found", 404);

  if (!post.author.equals(req.user._id)) {
    return errorRes(res, "Not authorized to delete this post", 403);
  }

  await post.deleteOne();

  return successRes(res, {}, "Post deleted successfully");
});
//#endregion
