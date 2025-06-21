<<<<<<< HEAD
// 📦 awsZipHandler.js (new utility module)
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const unzipper = require("unzipper");

async function handleZipUpload(zipFile, s3Client, s3Bucket) {
=======
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import unzipper from "unzipper";

export default async function handleZipUpload(zipFile, s3Client, s3Bucket) {
>>>>>>> 497afeb (shifting backend to esm)
  const extractedFiles = [];
  const dateStr = new Date().toISOString().slice(0, 10);

  const directory = await unzipper.Open.buffer(zipFile.buffer);

  if (!directory.files.some((f) => /\.(glb|obj|stl)$/i.test(f.path))) {
    throw new Error("Zip must contain at least one .glb, .obj, or .stl file.");
  }

  for (const entry of directory.files) {
    if (entry.type === "File" && /\.(glb|obj|stl)$/i.test(entry.path)) {
      const buffer = await entry.buffer();
      const ext = entry.path.split(".").pop().toLowerCase();
      const key = `${dateStr}-${uuidv4()}-${entry.path}`;
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
<<<<<<< HEAD

module.exports = { handleZipUpload };
=======
>>>>>>> 497afeb (shifting backend to esm)
