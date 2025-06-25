//#region 📦 Imports
import asyncHandler from "express-async-handler";
import { getBase64FileFromS3 } from "../services/s3/getBase64File.js";
import { uploadFileToS3 } from "../services/s3/uploadFile.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";
import { streamS3File } from "../services/s3/streamFile.js";
import handleZipUpload from "../services/s3/uploadZipHandler.js";
import { isValidZip } from "../utils/validators.js";
//#endregion

//#region 🎯 Retrieve Files
export const retrieveFile = asyncHandler(async (req, res) => {
  const data = await getBase64FileFromS3(req.params.id);
  res.status(200).json({ success: true, data });
});

export const retrievePublicFile = async (req, res) => {
  try {
    const data = await getBase64FileFromS3(req.params.id);
    res.send(data);
  } catch (err) {
    console.error("Public fetch error:", err);
    res.status(404).json({ error: "File not found" });
  }
};
//#endregion

//#region ⬆️ Upload
export const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file || req.files?.[0];
  const result = await uploadFileToS3(file);
  res.status(200).json(result);
});

export const uploadZipAndExtract = asyncHandler(async (req, res) => {
  const zipFile = req.file || req.files?.[0];
  if (!isValidZip(zipFile)) {
    return res
      .status(400)
      .json({ success: false, error: "Only .zip files allowed" });
  }

  const result = await handleZipUpload(zipFile);
  res.json({
    success: true,
    modelFiles: result.modelFiles,
    message: "ZIP and model files uploaded",
  });
});
//#endregion

//#region ❌ Delete
export const deleteFile = asyncHandler(async (req, res) => {
  const result = await deleteFileFromS3(req.params.id);
  res.json(result);
});
//#endregion

//#region 📺 Streaming
//video
export const streamFile = asyncHandler(async (req, res) => {
  await streamS3File(req.params.id, res);
});
//anyfile(raw)
export const streamAnyFile = asyncHandler(async (req, res) => {
  const key = decodeURIComponent(req.params.splat); // v5 wildcard
  if (!key) throw new Error("S3 key is missing");
  await streamS3File(key, res);
});
//#endregion
