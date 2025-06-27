// utils/canAccessFile.js
import Post from "../models/postSchema.js";
import { canAccessPost } from "./access/canAccessPost.js";

export const canAccessFile = async (user, key) => {
  if (!key || typeof key !== "string") return false;

  if (key.startsWith("public/")) return true;
  if (!user) return false;

  const post = await Post.findOne({
    $or: [{ imageUrl: { $regex: key } }, { coverVideoUrl: { $regex: key } }],
  });

  return canAccessPost(post, user);
};
