// api/userApi.js
import axiosInstance from "./axiosInstance";
import { extractData } from "@/utils/apiHelper";

// Get current user
export async function getCurrentUser() {
  try {
    const { data } = await extractData(axiosInstance.get("/user/me"));
    return data;
  } catch (err) {
    if (err.message === "Unauthorized") return null;
    throw err;
  }
}

// Create user
export async function createUser(user) {
  try {
    const { message } = await extractData(axiosInstance.post("/user", user));
    return { success: true, message };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Edit user
export async function updateUserDetails(data) {
  try {
    const { message } = await extractData(axiosInstance.put("/user/me", data));
    return { success: true, message };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Login / Verify user
export async function verifyUser(user) {
  try {
    const { data, message } = await extractData(
      axiosInstance.post("/user/login", user)
    );
    return {
      success: true,
      message,
      username: data.username,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

// Logout
export async function logoutUser() {
  try {
    await extractData(axiosInstance.post("/user/logout"));
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

// Update profile picture
export async function updateProfilePic(profilePicKey) {
  try {
    const { data } = await extractData(
      axiosInstance.put("/user/profile-pic", { profilePic: profilePicKey })
    );
    return {
      success: true,
      profilePic: data.profilePic,
      profilePicUrl: data.profilePicUrl, // ✅ new
    };
  } catch (err) {
    console.error("Error updating profile picture:", err);
    return { success: false };
  }
}

// Resend verification
export async function resendVerification(email) {
  try {
    const { message } = await extractData(
      axiosInstance.post("/user/resend-verify", { email })
    );
    return { success: true, message };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Get all users
export async function getUsers() {
  try {
    const { data } = await extractData(axiosInstance.get("/user"));
    return data.users;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}

// Delete user
export async function deleteUser(id) {
  try {
    const { data } = await extractData(axiosInstance.delete(`/user/${id}`));
    return data;
  } catch (err) {
    console.error("Error deleting user:", err);
    return null;
  }
}
