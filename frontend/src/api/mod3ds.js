import axiosInstance from "./axiosInstance";
import { extractData } from "../utils/apiHelper";

// 🔍 Public models
export async function getPublicMod3ds() {
  try {
    const { data } = await extractData(axiosInstance.get("/mod3ds/public"));
    return data;
  } catch (err) {
    console.error("⚠️ Error fetching public mod3ds:", err.message);
    return [];
  }
}

// 🔍 All models
export async function getMod3ds() {
  try {
    const { data } = await extractData(axiosInstance.get("/mod3ds"));
    return data;
  } catch (err) {
    console.error("⚠️ Error fetching mod3ds:", err.message);
    throw err;
  }
}

// 🔍 Single model
export async function getMod3d(id) {
  try {
    const { data } = await extractData(axiosInstance.get(`/mod3ds/${id}`));
    return data;
  } catch (err) {
    console.error("⚠️ Error fetching mod3d:", err.message);
    throw err;
  }
}

// ⬆️ Upload model
export async function uploadMod3d(payload) {
  try {
    const { data, message } = await extractData(
      axiosInstance.post("/mod3ds", payload)
    );
    return { success: true, data, message };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ✏️ Edit model
export async function editMod3d(id, updatedMod3d) {
  try {
    const { data, message } = await extractData(
      axiosInstance.put(`/mod3ds/${id}`, updatedMod3d)
    );
    return { success: true, data, message };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 🗑 Delete model
export async function deleteMod3d(id) {
  try {
    const { message } = await extractData(
      axiosInstance.delete(`/mod3ds/${id}`)
    );
    return { success: true, message };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
