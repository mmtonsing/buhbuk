//#region imports
import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import asyncHandler from "express-async-handler";
import { successRes, errorRes } from "../utils/responseHelper.js";
//#endregion

//#region 🔁 Toggle Like
export const toggleLike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user?._id;

  // Defensive checks
  if (
    !mongoose.Types.ObjectId.isValid(postId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return errorRes(res, "Invalid post or user ID", 400);
  }

  const post = await Post.findById(postId);
  if (!post) return errorRes(res, "Post not found", 404);

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const index = post.likedBy.findIndex((id) => id.equals(userObjectId));

  let liked;

  if (index === -1) {
    post.likedBy.push(userObjectId); // Like
    liked = true;
  } else {
    post.likedBy.splice(index, 1); // Unlike
    liked = false;
  }

  await post.save();

  return successRes(
    res,
    {
      liked,
      count: post.likedBy.length,
    },
    liked ? "Liked successfully" : "Unliked successfully"
  );
});
//#endregion
