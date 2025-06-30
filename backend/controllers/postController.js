//#region Imports
import asyncHandler from "express-async-handler";
import Post from "../models/postSchema.js";
import { successRes, errorRes } from "../utils/responseHelper.js";
import { resolveMediaUrls } from "../utils/resolveMediaUrls.js";
import { resolveUserUrls } from "../utils/resolveUserUrls.js";
//#endregion

//#region 🔍 Public Posts (Preview & Feed)
export const getPublicPosts = asyncHandler(async (req, res) => {
  const { category, tag, sort = "latest", limit = 8, page = 1 } = req.query;

  const filter = { isPublic: true };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  let postsQuery = Post.find(filter)
    .populate("author", "username profilePic")
    .populate({ path: "refId", select: "-__v" });

  const shouldSortInMemory = sort === "trending" || sort === "popular";

  if (!shouldSortInMemory) {
    if (sort === "latest") {
      postsQuery = postsQuery.sort({ createdAt: -1 });
    }
    postsQuery = postsQuery.skip(skip).limit(parsedLimit);
  } else {
    postsQuery = postsQuery.limit(100); // fetch top 100 candidates to allow proper slicing
  }

  const rawPosts = await postsQuery;

  const enrichedPosts = rawPosts
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

  let finalPosts = enrichedPosts;

  // 🧠 Apply in-memory sorting + pagination only for "trending"
  if (sort === "trending") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    finalPosts = enrichedPosts
      .map((post) => {
        const isRecent = new Date(post.createdAt) > oneWeekAgo;
        const score = (post.likedBy?.length || 0) + (isRecent ? 5 : 0);
        return { ...post, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.createdAt) - new Date(a.createdAt); // Tie-breaker
      })
      .slice(skip, skip + parsedLimit); // manual pagination
  } else if (sort === "popular") {
    finalPosts = enrichedPosts
      .map((post) => ({
        ...post,
        likes: post.likedBy?.length || 0,
      }))
      .sort((a, b) => {
        if (b.likes !== a.likes) return b.likes - a.likes;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(skip, skip + parsedLimit);
  }

  return successRes(res, { posts: finalPosts }, "Fetched public posts");
});

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
