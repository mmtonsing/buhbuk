//#region 📦 Imports
import asyncHandler from "express-async-handler";
import { getBase64FileFromS3 } from "../services/s3/getBase64File.js";
import { uploadFileToS3 } from "../services/s3/uploadFile.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";
import { streamS3File } from "../services/s3/streamFile.js";
import handleZipUpload from "../services/s3/uploadZipHandler.js";
import { isValidZip } from "../utils/validators.js";
import { successRes, errorRes } from "../utils/responseHelper.js";
// import { canAccessFile } from "../utils/canAccessFile.js";
// import Post from "../models/postSchema.js";
//#endregion

//#region 🎯 Retrieve Files
export const getFile = asyncHandler(async (req, res) => {
  const key = req.params.id;
  if (!key) return errorRes(res, "Missing file key", 400);

  const data = await getBase64FileFromS3(key);
  return successRes(res, { base64: data }, "File fetched successfully");
});

export const getPublicFile = asyncHandler(async (req, res) => {
  const key = req.params.id;
  try {
    const data = await getBase64FileFromS3(key);
    res.send(data);
  } catch (err) {
    console.error("❌ Public fetch error:", err.message);
    return errorRes(res, "File not found", 404);
  }
});
//#endregion

//#region ⬆️ Upload
export const createFile = asyncHandler(async (req, res) => {
  const file = req.file || req.files?.[0];
  if (!file) return errorRes(res, "No file uploaded", 400);

  const result = await uploadFileToS3(file);
  return successRes(res, result, "File uploaded to S3");
});

export const uploadZipAndExtract = asyncHandler(async (req, res) => {
  const zipFile = req.file || req.files?.[0];
  if (!zipFile || !isValidZip(zipFile)) {
    return errorRes(res, "Only .zip files allowed", 400);
  }

  const result = await handleZipUpload(zipFile);
  return successRes(
    res,
    { modelFiles: result.modelFiles },
    "ZIP extracted and model files uploaded"
  );
});
//#endregion

//#region ❌ Delete
export const deleteFile = asyncHandler(async (req, res) => {
  const key = req.params.id;
  if (!key) return errorRes(res, "Missing file key", 400);

  const result = await deleteFileFromS3(key);
  return successRes(res, result, "File deleted from S3");
});
//#endregion

//#region 📺 Streaming
export const streamFile = asyncHandler(async (req, res) => {
  const key = req.params.id;
  if (!key) return errorRes(res, "Missing file key", 400);

  // const user = req.user || null;

  // const hasAccess = await canAccessFile(user, key);
  // if (!hasAccess) return errorRes(res, "Unauthorized to access this file", 403);

  await streamS3File(key, res);
});

export const streamAnyFile = asyncHandler(async (req, res) => {
  const key = decodeURIComponent(req.params.splat);
  if (!key) return errorRes(res, "Missing S3 key", 400);

  // const user = req.user || null;
  // const hasAccess = await canAccessFile(user, key); // ✅ Correct usage
  // if (!hasAccess) return errorRes(res, "Unauthorized access", 403);

  await streamS3File(key, res);
});
//#endregion

// const assertAccessAndStream = async (key, user, res) => {
//   const allowed = await canAccessFile(user, key);
//   if (!allowed) throw new Error("Unauthorized");
//   await streamS3File(key, res);
// };
