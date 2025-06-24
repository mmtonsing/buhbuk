import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";

const s3Bucket = process.env.AWS_BUCKET_NAME;

export async function streamS3File(key, res) {
  const command = new GetObjectCommand({ Bucket: s3Bucket, Key: key });
  const data = await s3Client.send(command);

  res.setHeader("Content-Type", data.ContentType || "application/octet-stream");
  data.Body.pipe(res);
}
