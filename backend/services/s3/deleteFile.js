import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";

const s3Bucket = process.env.AWS_BUCKET_NAME;

export async function deleteFileFromS3(key) {
  if (!key || typeof key !== "string") {
    console.warn("⚠️ Invalid S3 key for deletion:", key);
    return;
  }

  const command = new DeleteObjectCommand({ Bucket: s3Bucket, Key: key });

  try {
    await s3Client.send(command);
    return { success: true, message: `Deleted ${key}` };
  } catch (err) {
    console.error("❌ Failed to delete:", err.message);
    throw err;
  }
}
