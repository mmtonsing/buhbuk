import axiosInstance from "./axiosInstance";

export async function getBlogById(id) {
  const res = await axiosInstance.get(`/blogs/${id}`);
  return res.data;
}
