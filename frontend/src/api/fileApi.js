import axiosInstance from "./axiosInstance";

// 📤 Upload file to S3
export async function createFile(file) {
  // console.log(file);
  if (!(file instanceof File) || !file.name) {
    // console.warn("❌ createFile called with:", file);
    throw new Error("Invalid file object");
  }

  const ext = file.name.split(".").pop().toLowerCase();
  const formData = new FormData();
  formData.append("file", file);

  const route = ext === "zip" ? "/file/zip" : "/file";
  const response = await axiosInstance.post(route, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // console.log("📤 Uploading file:", file.name);
  // console.log("File upload result:", response.data);

  return response.data;
}

// Get public file (no auth)
export async function getFilePublic(id) {
  try {
    const { data } = await axiosInstance.get(`/file/public/${id}`);
    return data;
  } catch (err) {
    console.error("⚠️ Failed to fetch public file:", err.message);
    return null;
  }
}

//  Get file (auth)
export async function getFile(id) {
  try {
    const { data } = await axiosInstance.get(`/file/${id}`);
    return data;
  } catch (err) {
    console.error("⚠️ Failed to fetch file:", err.message);
    return null;
  }
}
