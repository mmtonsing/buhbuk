//#region imports
import asyncHandler from "express-async-handler";
import Mod3d from "../models/mod3dSchema.js";
import Post from "../models/postSchema.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";
import { successRes, errorRes } from "../utils/responseHelper.js";
import { getS3PublicUrl } from "../services/s3/getS3PublicUrl.js";
import { resolveUserUrls } from "../utils/resolveUserUrls.js";
import { resolveMediaUrls } from "../utils/resolveMediaUrls.js";
//#endregion

//#region 🧹 Cleanup S3
const cleanupS3Files = async ({ imageId, videoId, modelFiles }) => {
  try {
    if (imageId) await deleteFileFromS3(imageId);
    if (videoId) await deleteFileFromS3(videoId);
    if (Array.isArray(modelFiles)) {
      for (const file of modelFiles) {
        if (file?.key) await deleteFileFromS3(file.key);
      }
    }
  } catch (cleanupErr) {
    console.warn("⚠️ S3 cleanup failed:", cleanupErr.message);
  }
};
//#endregion

//#region 🆕 Upload Model
export const uploadModel = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return errorRes(res, "Unauthorized: user not found", 401);

  const {
    title,
    description,
    price,
    imageId,
    videoId,
    modelFiles = [],
  } = req.body;

  // const imageUrl = getS3PublicUrl(
  //   imageId.startsWith("public/") ? imageId : `public/${imageId}`
  // );

  const imageUrl = getS3PublicUrl(imageId);

  const mod3d = new Mod3d({
    title,
    description,
    price,
    imageId,
    videoId,
    modelFiles,
    author: userId,
  });

  try {
    await mod3d.save();
  } catch (err) {
    console.error("❌ Mod3d save failed:", err);
    await cleanupS3Files({ imageId, videoId, modelFiles });
    return errorRes(res, "Failed to save model", 400);
  }

  const isPremium = !!price && price > 0;

  const post = await Post.create({
    category: "Mod3d",
    refId: mod3d._id,
    author: userId,
    title,
    imageUrl,
    isPublic: true,
    isPremium,
    price: price || 0,
  });

  await Mod3d.updateOne({ _id: mod3d._id }, { postId: post._id });

  return successRes(
    res,
    { ...mod3d.toObject(), postId: post._id },
    "3D model uploaded successfully"
  );
});
//#endregion

//#region 🟢 Retrieve All
export const retrieveAllPublic = asyncHandler(async (req, res) => {
  const publicMods = await Mod3d.find({
    $or: [{ isPublic: true }, { isPublic: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .populate("author", "username email profilePic emailVerified");

  const enriched = await Promise.all(
    publicMods.map(async (mod) => {
      const enrichedMod = resolveMediaUrls(mod);
      const enrichedAuthor = resolveUserUrls(mod.author);

      const post = await Post.findOne({
        category: "Mod3d",
        refId: mod._id,
      }).select("_id likedBy");

      return {
        ...enrichedMod,
        postId: post?._id || null,
        likedBy: post?.likedBy || [],
        author: enrichedAuthor,
      };
    })
  );

  return successRes(res, enriched, "Fetched public models");
});

export const retrieveAll = asyncHandler(async (req, res) => {
  const mod3ds = await Mod3d.find().populate(
    "author",
    "username email profilePic"
  );

  const enriched = mod3ds.map((mod) => {
    const enrichedMod = resolveMediaUrls(mod);
    const enrichedAuthor = resolveUserUrls(mod.author);
    return {
      ...enrichedMod,
      author: enrichedAuthor,
    };
  });

  return successRes(res, enriched, "Fetched all models");
});
//#endregion

//#region 🔍 Retrieve One
export const retrieveModel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID format (must be 24-char hex string)
  if (!id || id.length !== 24) {
    return errorRes(res, "Invalid model ID", 400);
  }

  const mod3d = await Mod3d.findById(id)
    .populate("author", "username email profilePic")
    .populate("postId");

  if (!mod3d) return errorRes(res, "Model not found", 404);

  const enriched = resolveMediaUrls(mod3d);
  const enrichedAuthor = resolveUserUrls(mod3d.author);

  return successRes(
    res,
    {
      ...enriched,
      author: enrichedAuthor,
    },
    "Fetched 3D model"
  );
});
//#endregion

//#region ✏️ Edit
export const editModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  const existing = await Mod3d.findById(id);
  if (!existing) return errorRes(res, "Model not found", 404);

  if (updatedFields.imageId && updatedFields.imageId !== existing.imageId) {
    if (existing.imageId) await deleteFileFromS3(existing.imageId);
  }

  if (updatedFields.videoId && updatedFields.videoId !== existing.videoId) {
    if (existing.videoId) await deleteFileFromS3(existing.videoId);
  }

  if (
    Array.isArray(updatedFields.modelFiles) &&
    JSON.stringify(updatedFields.modelFiles) !==
      JSON.stringify(existing.modelFiles)
  ) {
    for (const file of existing.modelFiles || []) {
      if (file?.key) await deleteFileFromS3(file.key);
    }
  }

  const updated = await Mod3d.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });

  return successRes(
    res,
    resolveMediaUrls(updated),
    "Model updated successfully"
  );
});
//#endregion

//#region ❌ Delete
export const deleteModel = asyncHandler(async (req, res) => {
  const mod3d = await Mod3d.findById(req.params.id);
  if (!mod3d) return errorRes(res, "Model not found", 404);

  if (!mod3d.author.equals(req.user._id)) {
    return errorRes(res, "Not authorized", 403);
  }

  await cleanupS3Files({
    imageId: mod3d.imageId,
    videoId: mod3d.videoId,
    modelFiles: mod3d.modelFiles,
  });

  await Post.findOneAndDelete({ category: "Mod3d", refId: mod3d._id });
  await Mod3d.findByIdAndDelete(mod3d._id);

  return successRes(res, {}, "Model deleted successfully");
});
//#endregion
