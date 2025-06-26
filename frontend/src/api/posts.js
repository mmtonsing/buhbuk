import axiosInstance from "./axiosInstance";
import { extractData } from "@/utils/apiHelper";

// 📰 Fetch latest preview posts (limited)
export async function getLatestPosts({ category, tag } = {}) {
  const params = {};
  if (category) params.category = category;
  if (tag) params.tag = tag;

  const res = await axiosInstance.get("/posts/public", { params });
  const { data } = await extractData(res);
  return data.posts || [];
}

// ❌ We no longer use this — and if you ever re-enable it, remove getFilePublic
// 📰 Get feed with pagination not useed anymoreeeeee
export async function getFeedPosts(page = 1, limit = 9) {
  const { data } = await extractData(
    axiosInstance.get(`/posts/feed?page=${page}&limit=${limit}`)
  );

  return {
    posts: data.posts, // imageUrl should come from backend
    currentPage: data.currentPage,
    totalPages: data.totalPages,
  };
}

// Get all public posts (preview)
export async function getPublicPosts() {
  const { data } = await extractData(axiosInstance.get("/posts/public"));
  return data;
}

// Get posts created by owner
export async function getMyPosts() {
  const { data } = await extractData(axiosInstance.get(`/posts/user/me`));

  return data;
}

export async function getUserPosts(userId) {
  const { data } = await extractData(
    axiosInstance.get(`/posts/user/${userId}`)
  );
  return data;
}

// Create a post (usually after uploading a model/graphic/blog)
export async function createPost(category, refId) {
  const { data, message } = await extractData(
    axiosInstance.post("/posts", { category, refId })
  );
  return { data, message };
}

// Delete a post
export async function deletePost(id) {
  const { message } = await extractData(axiosInstance.delete(`/posts/${id}`));
  return { success: true, message };
}
