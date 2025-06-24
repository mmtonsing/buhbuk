import { PutObjectCommand } from "@aws-sdk/client-s3";
import unzipper from "unzipper";
import { v4 as uuidv4 } from "uuid";
import s3Client from "./s3Client.js";

const s3Bucket = process.env.AWS_BUCKET_NAME;

export default async function handleZipUpload(zipFile) {
  const extractedFiles = [];
  const dateStr = new Date().toISOString().slice(0, 10);

  const directory = await unzipper.Open.buffer(zipFile.buffer);

  const has3DModel = directory.files.some((f) =>
    /\.(glb|obj|stl)$/i.test(f.path)
  );
  if (!has3DModel) {
    throw new Error("Zip must contain at least one .glb, .obj, or .stl file.");
  }

  for (const entry of directory.files) {
    if (entry.type === "File" && /\.(glb|obj|stl)$/i.test(entry.path)) {
      const buffer = await entry.buffer();
      const ext = entry.path.split(".").pop().toLowerCase();
      const key = `${dateStr}-${uuidv4()}-${entry.path}`;

      console.log(key);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: key,
          Body: buffer,
          ContentType:
            ext === "glb"
              ? "model/gltf-binary"
              : ext === "obj"
              ? "model/obj"
              : "model/stl",
        })
      );

      extractedFiles.push({ key, type: ext, originalName: entry.path });
    }
  }

  // Upload the original ZIP file too
  const zipKey = `${dateStr}-${uuidv4()}-${zipFile.originalname}`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: zipKey,
      Body: zipFile.buffer,
      ContentType: "application/zip",
    })
  );

  return {
    modelFiles: [
      { key: zipKey, type: "zip", originalName: zipFile.originalname },
      ...extractedFiles,
    ],
  };
}
