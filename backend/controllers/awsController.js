import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { deleteFileFromS3 } from "../utils/s3.js";
import handleZipUpload from "../utils/awsZipHandler.js";
import { v4 as uuidv4 } from "uuid";

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",

  "model/gltf+json", // ✅ .gltf
  "model/obj", // ✅ .obj
  "model/stl", // ✅ .stl
  "application/octet-stream",
  "model/gltf-binary", // ✅ .glb

  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/zip",
  "application/x-zip-compressed",
];

const s3Bucket = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const retrieveFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = { Bucket: s3Bucket, Key: id };

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

export const uploadFile = async (req, res) => {
  try {
    const file = req.files?.[0] || req.file;
    // console.log("File received:", file);
    console.log("🧾 Uploading:", {
      name: file.originalname,
      type: file.mimetype,
      sizeMB: (file.size / 1024 / 1024).toFixed(2) + " MB",
    });
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ error: `Unsupported file type: ${file.mimetype}` });
    }

    const isVideo = file.mimetype.startsWith("video/");
    const maxSize = isVideo ? 20 * 1024 * 1024 : 50 * 1024 * 1024; //50MB
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

    // if (process.env.NODE_ENV !== "production") {
    //   console.log("Fetching file:", id);
    // }

    res.send(fileData);
  } catch (err) {
    console.error("S3 fetch error:", err.name, err.message);
    return res.status(404).json({ error: "File not found in S3" });
  }
};

export const deleteFile = async (req, res) => {
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

    const result = await handleZipUpload(zipFile, s3Client, s3Bucket);
    res.json({
      modelFiles: result.modelFiles,
      message: "ZIP and model files uploaded",
    });
  } catch (err) {
    console.error("❌ ZIP Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

export const streamFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = { Bucket: s3Bucket, Key: id };

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

//for 3d rendering
export const streamAnyFile = async (req, res) => {
  try {
    const id = req.params.id;
    const bucketParams = { Bucket: s3Bucket, Key: id };

    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const contentType = data.ContentType || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    const stream = data.Body;
    stream.pipe(res);
  } catch (err) {
    console.error("❌ File stream error:", err.message);
    res.status(404).json({ error: "File not found" });
  }
};
