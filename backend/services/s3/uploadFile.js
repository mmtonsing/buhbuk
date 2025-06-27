import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";
import { v4 as uuidv4 } from "uuid";
import { getS3PublicUrl } from "./getS3PublicUrl.js";

const s3Bucket = process.env.AWS_BUCKET_NAME;

// Allowed MIME types
const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
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
];

// Maximum size per type (in bytes)
const maxSizeByCategory = {
  image: 10 * 1024 * 1024, // 10MB
  video: 20 * 1024 * 1024, // 20MB
  model: 50 * 1024 * 1024, // 50MB
  zip: 50 * 1024 * 1024, // 50MB
  default: 10 * 1024 * 1024,
};

// Detect category based on mimetype
function getCategory(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (
    [
      "model/gltf+json",
      "model/obj",
      "model/stl",
      "model/gltf-binary",
      "application/octet-stream",
    ].includes(mimetype)
  )
    return "model";
  if (["application/zip", "application/x-zip-compressed"].includes(mimetype))
    return "zip";
  return "default";
}

export async function uploadFileToS3(file) {
  if (!file) throw new Error("No file provided");

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Unsupported file type: ${file.mimetype}`);
  }

  const category = getCategory(file.mimetype);
  const maxSize = maxSizeByCategory[category] || maxSizeByCategory.default;

  if (file.size > maxSize) {
    throw new Error(
      `File exceeds ${Math.round(
        maxSize / (1024 * 1024)
      )}MB limit for ${category}`
    );
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const key = `public/${dateStr}-${uuidv4()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: s3Bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  const data = await s3Client.send(command);

  return {
    key,
    url: getS3PublicUrl(key),
    etag: data.ETag,
    type: file.mimetype,
    size: file.size,
    originalName: file.originalname,
  };
}
