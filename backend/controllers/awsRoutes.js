import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
<<<<<<< HEAD
} = require("@aws-sdk/client-s3");
const { deleteFileFromS3 } = require("../utils/s3");
const { handleZipUpload } = require("../utils/awsZipHandler");

const { v4: uuidv4 } = require("uuid");

const allowedMimeTypes = [
  // Images
=======
} from "@aws-sdk/client-s3";
import { deleteFileFromS3 } from "../utils/s3.js";
import handleZipUpload from "../utils/awsZipHandler.js";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

const allowedMimeTypes = [
>>>>>>> 497afeb (shifting backend to esm)
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
<<<<<<< HEAD

  // 3D Models
  "model/gltf+json", // .gltf
  "model/obj", // .obj
  "model/stl", // .stl
  "application/octet-stream", // some .glb files
  "model/gltf-binary", // official .glb

  // Videos (optional for future)
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // ZIP
  "application/zip",
  "application/x-zip-compressed", // ✅ Windows .zip
=======
  "model/gltf+json",
  "model/obj",
  "model/stl",
  "application/octet-stream",
  "model/gltf-binary",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/zip",
  "application/x-zip-compressed",
>>>>>>> 497afeb (shifting backend to esm)
];

const s3Bucket = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

<<<<<<< HEAD
// 🔍 Retrieve a file from S3 and return base64 string for rendering
module.exports.retrieveFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = {
      Bucket: s3Bucket,
      Key: id,
    };

    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const contentType = data.ContentType;
    const srcString = await data.Body.transformToString("base64");
    const fileData = `data:${contentType};base64,${srcString}`;

    res.json(fileData);
  } catch (err) {
    console.error("Error retrieving file from S3:", err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

// ⬆️ Upload file to S3 (supports images, 3D models, videos)
module.exports.uploadFile = async (req, res) => {
  try {
    const file = req.files?.[0] || req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ error: `Unsupported file type: ${file.mimetype}` });
    }

    // file size check based on type
    const isVideo =
      file.mimetype.startsWith("video/") ||
      ["video/mp4", "video/webm", "video/quicktime"].includes(file.mimetype);

    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for others
    if (file.size > maxSize) {
      return res.status(400).json({
        error: `File exceeds ${isVideo ? "50MB" : "10MB"} size limit`,
      });
    }

    //unique id with date
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;
    const uniqueKey = `${dateStr}-${uuidv4()}-${file.originalname}`;

    const bucketParams = {
      Bucket: s3Bucket,
      Key: uniqueKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3Client.send(new PutObjectCommand(bucketParams));

    res.status(200).json({
      key: uniqueKey,
      etag: data.ETag,
      type: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

// 🌐 Public file retrieval (base64)
module.exports.retrievePublicFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = {
      Bucket: s3Bucket,
      Key: id,
    };
=======
export const retrieveFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = { Bucket: s3Bucket, Key: id };
>>>>>>> 497afeb (shifting backend to esm)

    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const contentType = data.ContentType;
    const srcString = await data.Body.transformToString("base64");
    const fileData = `data:${contentType};base64,${srcString}`;

<<<<<<< HEAD
    if (process.env.NODE_ENV !== "production") {
      console.log("Fetching file:", id);
    }

    res.send(fileData);
  } catch (err) {
    console.error("S3 fetch error:", err.name, err.message);
    return res.status(404).json({ error: "File not found in S3" });
  }
};

// ❌ Delete file from S3
module.exports.deleteFile = async (req, res) => {
=======
    res.json(fileData);
  } catch (err) {
    console.error("Error retrieving file from S3:", err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const file = req.files?.[0] || req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ error: `Unsupported file type: ${file.mimetype}` });
    }

    const isVideo = file.mimetype.startsWith("video/");
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({
        error: `File exceeds ${isVideo ? "50MB" : "10MB"} size limit`,
      });
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;
    const uniqueKey = `${dateStr}-${uuidv4()}-${file.originalname}`;

    const bucketParams = {
      Bucket: s3Bucket,
      Key: uniqueKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3Client.send(new PutObjectCommand(bucketParams));

    res.status(200).json({
      key: uniqueKey,
      etag: data.ETag,
      type: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

export const retrievePublicFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = { Bucket: s3Bucket, Key: id };

    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const contentType = data.ContentType;
    const srcString = await data.Body.transformToString("base64");
    const fileData = `data:${contentType};base64,${srcString}`;

    if (process.env.NODE_ENV !== "production") {
      console.log("Fetching file:", id);
    }

    res.send(fileData);
  } catch (err) {
    console.error("S3 fetch error:", err.name, err.message);
    return res.status(404).json({ error: "File not found in S3" });
  }
};

export const deleteFile = async (req, res) => {
>>>>>>> 497afeb (shifting backend to esm)
  try {
    const result = await deleteFileFromS3(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("S3 delete error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete from S3", details: err.message });
  }
};

<<<<<<< HEAD
//Upload zip
module.exports.uploadZipAndExtract = async (req, res) => {
  try {
    const zipFile = req.files?.[0];
    console.log("req.file:", req.file);
    console.log("req.files:", req.files);
=======
export const uploadZipAndExtract = async (req, res) => {
  try {
    const zipFile = req.files?.[0];

>>>>>>> 497afeb (shifting backend to esm)
    if (
      !zipFile ||
      !["application/zip", "application/x-zip-compressed"].includes(
        zipFile.mimetype
      )
    ) {
<<<<<<< HEAD
      console.log("is not zip fie man");
=======
>>>>>>> 497afeb (shifting backend to esm)
      return res.status(400).json({ error: "Only .zip files allowed" });
    }

    const result = await handleZipUpload(zipFile, s3Client, s3Bucket);
<<<<<<< HEAD
    console.log("handle zip upoload done ");
=======
>>>>>>> 497afeb (shifting backend to esm)
    res.json({
      modelFiles: result.modelFiles,
      message: "ZIP and model files uploaded",
    });
  } catch (err) {
    console.error("❌ ZIP Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

<<<<<<< HEAD
// Stream file from S3 directly (ideal for video)
module.exports.streamFile = async (req, res) => {
  try {
    const id = req.params.id;

    const bucketParams = {
      Bucket: s3Bucket,
      Key: id,
    };
=======
export const streamFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = { Bucket: s3Bucket, Key: id };
>>>>>>> 497afeb (shifting backend to esm)

    const s3Stream = await s3Client.send(new GetObjectCommand(bucketParams));
    const stream = s3Stream.Body;

    res.setHeader(
      "Content-Type",
      s3Stream.ContentType || "application/octet-stream"
    );
    stream.pipe(res);
  } catch (err) {
    console.error("Stream error:", err);
    res
      .status(500)
      .json({ error: "Video stream failed", details: err.message });
  }
};
