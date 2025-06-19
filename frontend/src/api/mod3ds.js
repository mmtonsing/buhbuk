import axiosInstance from "./axiosInstance";

// 🔍 Get public mod3ds (e.g. home page)
export async function getPublicMod3ds() {
  try {
    const { data: mod3ds } = await axiosInstance.get("/mod3ds/public");

    const mod3dsWithImages = await Promise.all(
      mod3ds.map(async (mod) => {
        const image = await getImagePublic(mod.imageId);
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
        const image = await getImage(mod.imageId);
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
    const image = await getImagePublic(mod.imageId);
    return { ...mod, image };
  } catch (err) {
    console.error("⚠️ Error fetching mod3d:", err.message);
    throw err;
  }
}

// ⬆️ Upload new mod3d (S3 first, then MongoDB)
export async function uploadMod3d(mod3d) {
  try {
    const uploadResponse = await createImage(mod3d.file);
    const imageId = mod3d.file.name; // Ensure it's same as key used in S3

    const payload = { ...mod3d, imageId };
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
    return res;
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

// 📤 Upload image to S3
export async function createImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post(`/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
}

// 🖼 Get image (auth)
export async function getImage(id) {
  try {
    const { data } = await axiosInstance.get(`/images/${id}`);
    return data;
  } catch (err) {
    console.error("⚠️ Failed to fetch image:", err.message);
    return null;
  }
}

// 🖼 Get public image (no auth)
export async function getImagePublic(id) {
  try {
    const { data } = await axiosInstance.get(`/images/public/${id}`);
    return data;
  } catch (err) {
    console.error("⚠️ Failed to fetch public image:", err.message);
    return null;
  }
}
