import axiosInstance from "./axiosInstance";

export async function toggleLikeAPI(modId, userId) {
  const res = await axiosInstance.post(`/mod3ds/${modId}/like`, { userId });
  return res.data; // { likes, liked }
}
