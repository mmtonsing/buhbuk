import axiosInstance from "./axiosInstance";
import { extractData } from "@/utils/apiHelper";

// 📰 Fetch public posts
export async function getPublicPosts({
  sort = "latest",
  category,
  tag,
  limit,
  page,
} = {}) {
  const params = {};
  if (category) params.category = category;
  if (tag) params.tag = tag;
  if (sort) params.sort = sort;
  if (limit) params.limit = limit;
  if (page) params.page = page;

  const res = await axiosInstance.get("/posts/public", { params });
  const { data } = await extractData(res);
  return data.posts || [];
}

// Like or unlike a post (all types: Mod3d, Blog, etc.)
export async function togglePostLike(postId) {
  const { data, message } = await extractData(
    axiosInstance.post(`/posts/${postId}/like`)
  );
  return { data, message };
}

// Get posts created by owner
export async function getMyPosts() {
  const { data } = await extractData(axiosInstance.get(`/posts/user/me`));
  return data;
}

//GetPosts by a user for public
export async function getUserPosts(userId) {
  const { data } = await extractData(
    axiosInstance.get(`/posts/user/${userId}`)
  );
  return data;
}
