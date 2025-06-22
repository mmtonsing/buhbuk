import axiosInstance from "./axiosInstance";
import { extractData } from "@/utils/apiHelper";
import { getFilePublic } from "./mod3ds";

// 📰 Fetch latest posts
export async function getLatestPosts() {
  const rawPosts = await extractData(axiosInstance.get("/posts/public"));

  const enrichedPosts = await Promise.all(
    rawPosts.map(async (post) => {
      let image = null;

      if (!post.refId) {
        console.warn("⚠️ Post is missing refId:", post._id);
      }

      if (post.category === "Mod3d") {
        if (!post.refId?.imageId) {
          console.warn("⚠️ Mod3d post missing imageId:", post._id, post.refId);
        } else {
          try {
            image = await getFilePublic(post.refId.imageId);
            if (!image) {
              console.warn("⚠️ Image fetch returned null:", post.refId.imageId);
            }
          } catch (err) {
            console.warn(
              "❌ Error fetching image from getFilePublic:",
              err.message
            );
          }
        }
      }

      return { ...post, image };
    })
  );

  return enrichedPosts;
}

export async function getFeedPosts(page = 1, limit = 9) {
  const { data } = await axiosInstance.get(
    `/posts/feed?page=${page}&limit=${limit}`
  );

  const rawPosts = data.posts;

  const enrichedPosts = await Promise.all(
    rawPosts.map(async (post) => {
      let image = null;

      if (post.category === "Mod3d" && post.refId?.imageId) {
        try {
          image = await getFilePublic(post.refId.imageId);
        } catch (err) {
          console.warn(
            "⚠️ Failed to fetch image for post:",
            post._id,
            err.message
          );
        }
      }

      return { ...post, image };
    })
  );

  return {
    posts: enrichedPosts,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
}

// Get all public posts
export async function getPublicPosts() {
  const { data } = await axiosInstance.get("/posts/public");
  return data;
}

// Get my posts (auth)
export async function getMyPosts() {
  const { data } = await axiosInstance.get("/posts/me");
  return data;
}

// Create a post after uploading content (e.g., Mod3d, Graphic, Blog)
export async function createPost(category, refId) {
  const { data } = await axiosInstance.post("/posts", { category, refId });
  return data;
}

// Delete a post
export async function deletePost(id) {
  const { data } = await axiosInstance.delete(`/posts/${id}`);
  return data;
}
