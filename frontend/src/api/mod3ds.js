import axiosInstance from "./axiosInstance";

// 🔍 Get public mod3ds (e.g. home page)
export async function getPublicMod3ds() {
  try {
    const { data: mod3ds } = await axiosInstance.get("/mod3ds/public");

    const mod3dsWithImages = await Promise.all(
      mod3ds.map(async (mod) => {
        const image = await getFilePublic(mod.imageId);
        return { ...mod, image };
      })
    );

    return mod3dsWithImages;
  } catch (err) {
    console.error("⚠️ Error fetching public mod3ds:", err.message);
    return [];
  }
}

// 🔍 Get all mod3ds (admin or user dashboard)
export async function getMod3ds() {
  try {
    const { data: mod3ds } = await axiosInstance.get("/mod3ds");

    const mod3dsWithImages = await Promise.all(
      mod3ds.map(async (mod) => {
        const image = await getFile(mod.imageId);
        return { ...mod, image };
      })
    );

    return mod3dsWithImages;
  } catch (err) {
    console.error("⚠️ Error fetching mod3ds:", err.message);
    throw err;
  }
}

// 🔍 Get single mod3d (view page)
export async function getMod3d(id) {
  try {
    const { data: mod } = await axiosInstance.get(`/mod3ds/${id}`);
    const image = await getFilePublic(mod.imageId);
    return { ...mod, image };
  } catch (err) {
    console.error("⚠️ Error fetching mod3d:", err.message);
    throw err;
  }
}

// ⬆️ Upload new mod3d (S3 first, then MongoDB)
// ⬆️ Upload new mod3d (image + modelFiles + optional video)
export async function uploadMod3d(payload) {
  try {
    const res = await axiosInstance.post("/mod3ds", payload);
    return res.data;
  } catch (err) {
    console.error("⚠️ Failed to upload mod3d:", err.message);
    throw err;
  }
}

// ✏️ Edit mod3d (image replacement logic handled in backend)
export async function editMod3d(id, updatedMod3d) {
  try {
    const res = await axiosInstance.put(`/mod3ds/${id}`, updatedMod3d);
    return res.data;
  } catch (err) {
    console.error("⚠️ Failed to edit mod3d:", err.message);
    throw err;
  }
}

// 🗑 Delete mod3d (deletes from DB + S3 via backend)
export async function deleteMod3d(id) {
  try {
    const res = await axiosInstance.delete(`/mod3ds/${id}`);
    return res;
  } catch (err) {
    console.error("⚠️ Failed to delete mod3d:", err.message);
    throw err;
  }
}

// 📤 Upload file to S3
export async function createFile(file) {
  console.log(file);
  if (!file || !file.name) {
    throw new Error("Invalid file object");
  }

  const ext = file.name.split(".").pop().toLowerCase();
  const formData = new FormData();
  formData.append("file", file);

  const route = ext === "zip" ? "/file/zip" : "/file";
  const response = await axiosInstance.post(route, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("📤 Uploading file:", file.name);
  return response;
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
