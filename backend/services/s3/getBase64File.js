import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js";

const s3Bucket = process.env.AWS_BUCKET_NAME;

export async function getBase64FileFromS3(key) {
  const command = new GetObjectCommand({ Bucket: s3Bucket, Key: key });
  const data = await s3Client.send(command);
  const base64 = await data.Body.transformToString("base64");
  return `data:${data.ContentType};base64,${base64}`;
}
