import { getBase64FileFromS3 } from "../services/s3/getBase64File.js";
import { uploadFileToS3 } from "../services/s3/uploadFile.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";
import { streamS3File } from "../services/s3/streamFile.js";
import handleZipUpload from "../services/s3/uploadZipHandler.js";

export const retrieveFile = async (req, res) => {
  try {
    const data = await getBase64FileFromS3(req.params.id);
    res.json(data);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

export const retrievePublicFile = async (req, res) => {
  try {
    const data = await getBase64FileFromS3(req.params.id);
    res.send(data);
  } catch (err) {
    console.error("Public fetch error:", err);
    res.status(404).json({ error: "File not found" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const file = req.file || req.files?.[0];
    const result = await uploadFileToS3(file);
    res.status(200).json(result);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const result = await deleteFileFromS3(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};

export const uploadZipAndExtract = async (req, res) => {
  try {
    const zipFile = req.file || req.files?.[0];
    if (
      !zipFile ||
      !["application/zip", "application/x-zip-compressed"].includes(
        zipFile.mimetype
      )
    ) {
      return res.status(400).json({ error: "Only .zip files allowed" });
    }

    const result = await handleZipUpload(zipFile);
    res.json({
      modelFiles: result.modelFiles,
      message: "ZIP and model files uploaded",
    });
  } catch (err) {
    console.error("ZIP upload error:", err);
    res.status(500).json({ error: "ZIP upload failed", details: err.message });
  }
};

//video
export const streamFile = async (req, res) => {
  try {
    await streamS3File(req.params.id, res);
  } catch (err) {
    console.error("Stream error:", err);
    res.status(500).json({ error: "Stream failed", details: err.message });
  }
};

export const streamAnyFile = async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.splat); // v5 wildcard
    if (!key) throw new Error("S3 key is missing");
    await streamS3File(key, res);
  } catch (err) {
    console.error("File stream error:", err);
    res.status(404).json({ error: "File not found" });
  }
};
