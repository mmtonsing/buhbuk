import axiosInstance from "./axiosInstance";
import { getImagePublic } from "./mod3ds";

// Get all users
export async function getUsers() {
  try {
    const res = await axiosInstance.get("/user");
    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}

// Get current user from secure cookie
export async function getCurrentUser() {
  try {
    const res = await axiosInstance.get("/user/me");
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      console.log("no user(getCurrentUser api)");
      return null; // ✅ just return null, don't redirect!
    }
    throw err; // let other errors bubble up
  }
}

// Create a user
export async function createUser(user) {
  try {
    const res = await axiosInstance.post("/user", user);
    return {
      success: true,
      message: res.data.message || "User created successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Account creation failed",
    };
  }
}

// Edit user
export async function editUser(id, user) {
  try {
    const res = await axiosInstance.put(`/user/${id}`, user);
    return res.data;
  } catch (err) {
    console.error("Error updating user:", err);
    return null;
  }
}

// Delete user
export async function deleteUser(id) {
  try {
    const res = await axiosInstance.delete(`/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    return null;
  }
}

// Login / Verify user
export async function verifyUser(user) {
  try {
    const res = await axiosInstance.post("/user/login", user);
    return {
      success: true,
      message: res.data.message || "Login successful",
      username: res.data.username,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
}

// Logout
export async function logoutUser() {
  try {
    await axiosInstance.post("/user/logout");
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

//Get user posts
export async function getUserPosts(id) {
  try {
    const res = await axiosInstance.get(`/user/${id}/posts`);
    const posts = res.data.posts || [];

    const postsWithImages = await Promise.all(
      posts.map(async (mod3d) => {
        const image = await getImagePublic(mod3d.imageId, true);
        return { ...mod3d, image };
      })
    );

    return postsWithImages;
  } catch (err) {
    console.error("Unable to retrieve User Posts", err);
    return [];
  }
}
