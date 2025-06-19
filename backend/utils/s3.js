// utils/s3.js
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Bucket = "bukwarm";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// 🔁 Export a reusable delete function
async function deleteFileFromS3(key) {
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
