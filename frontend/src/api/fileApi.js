// fileApi.js
import axiosInstance from "./axiosInstance";
import { getFileExtension } from "@/utils/fileValidators";

export async function createFile(file) {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file object");
  }

  const ext = getFileExtension(file);
  const formData = new FormData();
  formData.append("file", file);

  const route = ext === "zip" ? "/file/zip" : "/file";

  const response = await axiosInstance.post(route, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const resData = response.data;

  if (!resData.success) {
    throw new Error("Upload failed: " + (resData.message || "Unknown error"));
  }

  // Handle zip (returns modelFiles)
  if (ext === "zip") {
    if (!resData.data || !resData.data.modelFiles) {
      throw new Error("ZIP upload failed: modelFiles missing");
    }
    return resData.data; // ✅ returns { modelFiles: [...] }
  }

  // Handle image/video/single model
  if (!resData.data || !resData.data.key) {
    throw new Error("Upload failed: Invalid response data");
  }

  return resData.data; // ✅ returns { key: "...", ... }
}
