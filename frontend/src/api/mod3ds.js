import axiosInstance from "./axiosInstance";
import { extractData } from "../utils/apiHelper";
import { getFilePublic, getFile } from "./fileApi";

// 🔍 Get public mod3ds (e.g. home page)
export async function getPublicMod3ds() {
  try {
    const mod3ds = await extractData(axiosInstance.get("/mod3ds/public"));

    const mod3dsWithImages = await Promise.all(
      mod3ds.map(async (mod) => {
        const image = mod.imageId ? await getFilePublic(mod.imageId) : null;
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
    const mod3ds = await extractData(axiosInstance.get("/mod3ds"));

    const mod3dsWithImages = await Promise.all(
      mod3ds.map(async (mod) => {
        const image = mod.imageId ? await getFile(mod.imageId) : null;
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
    const mod = await extractData(axiosInstance.get(`/mod3ds/${id}`));
    const image = mod.imageId ? await getFilePublic(mod.imageId) : null;
    return { ...mod, image };
  } catch (err) {
    console.error("⚠️ Error fetching mod3d:", err.message);
    throw err;
  }
}

// ⬆️ Upload new mod3d (image + modelFiles + optional video) then to database
export async function uploadMod3d(payload) {
  try {
    return extractData(axiosInstance.post("/mod3ds", payload));
  } catch (err) {
    console.error("⚠️ Failed to upload mod3d:", err.message);
    throw err;
  }
}

// ✏️ Edit mod3d (image replacement logic handled in backend)
export async function editMod3d(id, updatedMod3d) {
  try {
    return extractData(axiosInstance.put(`/mod3ds/${id}`, updatedMod3d));
  } catch (err) {
    console.error("⚠️ Failed to edit mod3d:", err.message);
    throw err;
  }
}

// 🗑 Delete mod3d (deletes from DB + S3 via backend)
export async function deleteMod3d(id) {
  try {
    return extractData(axiosInstance.delete(`/mod3ds/${id}`));
  } catch (err) {
    console.error("⚠️ Failed to delete mod3d:", err.message);
    throw err;
  }
}
