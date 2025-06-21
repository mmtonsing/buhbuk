// utils/s3.js
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Bucket = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// 🔁 Export a reusable delete function
async function deleteFileFromS3(key) {
  if (typeof key !== "string" || key.trim() === "") {
    console.warn("⚠️ Skip deleting: invalid S3 key:", key);
    return;
  }
  try {
    const command = new DeleteObjectCommand({
      Bucket: s3Bucket,
      Key: key,
    });

    await s3Client.send(command);
    console.log("🧹 Deleted from S3:", key);
    return { success: true, message: `Deleted ${key}` };
  } catch (err) {
    console.error("❌ Failed to delete from S3:", err.message);
    throw err;
  }
}

module.exports = {
  deleteFileFromS3,
};
