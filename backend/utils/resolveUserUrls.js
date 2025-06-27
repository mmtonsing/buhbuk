// utils/resolveUserUrls.js
import { getS3PublicUrl } from "../services/s3/getS3PublicUrl.js";

export function resolveUserUrls(user) {
  const obj = user.toObject ? user.toObject() : user;
  return {
    ...obj,
    profilePicUrl: obj.profilePic ? getS3PublicUrl(obj.profilePic) : null,
  };
}
