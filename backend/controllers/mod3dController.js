import Mod3d from "../models/mod3dSchema.js";
import Post from "../models/postSchema.js";
import { deleteFileFromS3 } from "../services/s3/deleteFile.js";

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

export const uploadModel = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!req.user || !userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user not found" });
    }

    const { title, description, price, imageId, videoId } = req.body;

    const mod3d = new Mod3d({
      title,
      description,
      price,
      imageId,
      videoId,
      modelFiles: req.body.modelFiles || [],
      author: userId,
    });
    await mod3d.save();

    const post = new Post({
      category: "Mod3d",
      refId: mod3d._id,
      author: userId,
      isPublic: mod3d.isPublic,
    });
    await post.save();

    await Mod3d.updateOne({ _id: mod3d._id }, { postId: post._id });

    res.status(201).json({
      success: true,
      message: "3D model uploaded successfully",
      data: {
        ...mod3d.toObject(),
        postId: post._id,
      },
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    await cleanupS3Files({
      imageId: req.body.imageId,
      videoId: req.body.videoId,
      modelFiles: req.body.modelFiles,
    });
    res.status(500).json({
      success: false,
      message: "Failed to upload 3D model",
      error: err.message,
    });
  }
};

export const retrieveAllPublic = async (req, res) => {
  try {
    const publicMods = await Mod3d.find({
      $or: [{ isPublic: true }, { isPublic: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .populate("author", "username email profilePic");

    res.status(200).json({
      success: true,
      message: "Fetched all public models",
      data: publicMods,
    });
  } catch (err) {
    console.error("🔥 Error fetching public Mod3Ds:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public 3D models",
      error: err.message,
    });
  }
};

export const retrieveAll = async (req, res) => {
  try {
    const mod3ds = await Mod3d.find().populate(
      "author",
      "username email profilePic"
    );
    res.status(200).json({
      success: true,
      message: "Fetched all models",
      count: mod3ds.length,
      data: mod3ds,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve models",
      error: err.message,
    });
  }
};

export const retrieveModel = async (req, res) => {
  try {
    const mod3d = await Mod3d.findById(req.params.id)
      .populate("author", "username email profilePic")
      .populate("postId");

    if (!mod3d)
      return res
        .status(404)
        .json({ success: false, message: "Model not found" });

    res.status(200).json({
      success: true,
      message: "Fetched 3D model",
      data: mod3d,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve model",
      error: err.message,
    });
  }
};

export const editModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const existing = await Mod3d.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Model not found" });

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

    res.status(200).json({
      success: true,
      message: "Model updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("🔥 Update failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update model",
      error: err.message,
    });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const mod3d = await Mod3d.findById(req.params.id);
    if (!mod3d)
      return res
        .status(404)
        .json({ success: false, message: "Model not found" });

    if (!mod3d.author.equals(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await cleanupS3Files({
      imageId: mod3d.imageId,
      videoId: mod3d.videoId,
      modelFiles: mod3d.modelFiles,
    });

    //Delete Post and mod
    await Post.findOneAndDelete({ category: "Mod3d", refId: mod3d._id });
    await Mod3d.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Model deleted successfully" });
  } catch (err) {
    console.error("🔥 Delete model failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete model",
      error: err.message,
    });
  }
};
