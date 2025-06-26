import axiosInstance from "./axiosInstance";
import { extractData } from "@/utils/apiHelper";

// ❤️ Toggle like/unlike for a 3D mod
export async function toggleLikeAPI(modId, userId) {
  try {
    const { data, message } = await extractData(
      axiosInstance.post(`/mod3ds/${modId}/like`, { userId })
    );
    return { ...data, message };
  } catch (err) {
    console.error("❌ Failed to toggle like:", err.message);
    throw err;
  }
}
