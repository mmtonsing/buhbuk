// utils/createFile.js
import axiosInstance from "../api/axiosInstance";

export async function createFile(file, isZip = false) {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint = isZip ? "/file/zip" : "/file";
  const { data } = await axiosInstance.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}
