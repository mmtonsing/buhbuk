// utils/resolveMediaUrls.js
import { getS3PublicUrl } from "../services/s3/getS3PublicUrl.js";

export function resolveMediaUrls(content) {
  const obj = content.toObject ? content.toObject() : content;

  return {
    ...obj,
    imageUrl: obj.imageId?.startsWith("public/")
      ? getS3PublicUrl(obj.imageId)
      : null,
    videoUrl: obj.videoId?.startsWith("public/")
      ? getS3PublicUrl(obj.videoId)
      : null,
  };
}
