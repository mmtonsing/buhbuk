const Mod3d = require("../models/mod3d");
const { deleteFileFromS3 } = require("../utils/s3");

//retrieve
module.exports.retrieveAllPublic = async (req, res) => {
  try {
    const publicMods = await Mod3d.find({
      $or: [{ isPublic: true }, { isPublic: { $exists: false } }],
    })
      .sort({ dateCreated: -1 }) // newest first
      // .limit(3) //set limit 3
      .populate("author", "username email");

    res.json(publicMods);
  } catch (err) {
    console.error("🔥 Error fetching public mod3ds:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//retrieve all
module.exports.retrieveAll = async (req, res) => {
  try {
    const mod3ds = await Mod3d.find().populate("author", "username email");
    res.json(mod3ds);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve models" });
  }
};

//upload
module.exports.uploadModel = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const mod3d = new Mod3d({
      ...req.body,
      modelFiles: req.body.modelFiles || [],
      author: req.user.id,
    });

    await mod3d.save();
    res.json(mod3d);
  } catch (err) {
    console.error("❌ Error saving Mod3D:", err.message);

    // Clean up uploaded files if saving fails
    if (req.body.imageId) await deleteFileFromS3(req.body.imageId);

    if (req.body.modelFiles && Array.isArray(req.body.modelFiles)) {
      for (const file of req.body.modelFiles) {
        if (file?.key) await deleteFileFromS3(file.key);
      }
    }

    if (req.body.videoId) await deleteFileFromS3(req.body.videoId);

    res.status(500).json({ error: "Failed to upload 3D model" });
  }
};

//retrieve
module.exports.retrieveModel = async (req, res) => {
  try {
    const mod3d = await Mod3d.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!mod3d) return res.status(404).json({ error: "Model not found" });
    res.json(mod3d);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve model" });
  }
};

//edit model
module.exports.editModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const existing = await Mod3d.findById(id);
    if (!existing) return res.status(404).json({ error: "Model not found" });

    if (process.env.NODE_ENV !== "production") {
      console.log("📝 Edit request for:", id);
      console.log("📥 Payload:", updatedFields);
    }

    // 🖼️ Delete old image if replaced
    if (updatedFields.imageId && updatedFields.imageId !== existing.imageId) {
      if (existing.imageId) {
        await deleteFileFromS3(existing.imageId);
        console.log("🧹 Deleted old image:", existing.imageId);
      }
    }

    // 📦 Delete old model files if replaced
    if (
      Array.isArray(updatedFields.modelFiles) &&
      JSON.stringify(updatedFields.modelFiles) !==
        JSON.stringify(existing.modelFiles)
    ) {
      for (const file of existing.modelFiles || []) {
        if (file?.key) {
          await deleteFileFromS3(file.key);
          console.log("🧹 Deleted old model file:", file.key);
        }
      }
    }

    // 🎞️ Delete old video if replaced
    if (updatedFields.videoId && updatedFields.videoId !== existing.videoId) {
      if (existing.videoId) {
        await deleteFileFromS3(existing.videoId);
        console.log("🧹 Deleted old video:", existing.videoId);
      }
    }

    // 🛠️ Perform update
    const updated = await Mod3d.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating model:", err);
    res.status(500).json({
      error: "Failed to update model",
      details: err.message,
    });
  }
};

//delete model
module.exports.deleteModel = async (req, res) => {
  try {
    const mod3d = await Mod3d.findById(req.params.id);
    if (!mod3d) return res.status(404).json({ error: "Model not found" });

    if (!mod3d.author.equals(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete files
    if (mod3d.imageId) {
      await deleteFileFromS3(mod3d.imageId);
    }
    if (mod3d.modelFiles?.length) {
      for (const file of mod3d.modelFiles) {
        await deleteFileFromS3(file.key);
      }
    }
    if (mod3d.videoId) {
      await deleteFileFromS3(mod3d.videoId);
    }
    await Mod3d.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete model", details: err.message });
  }
};
