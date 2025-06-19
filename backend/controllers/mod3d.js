const Mod3d = require("../models/mod3d");
const { deleteFileFromS3 } = require("../utils/s3");

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

module.exports.retrieveAll = async (req, res) => {
  try {
    const mod3ds = await Mod3d.find().populate("author", "username email");
    res.json(mod3ds);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve models" });
  }
};

module.exports.uploadModel = async (req, res) => {
  try {
    const mod3d = new Mod3d({
      ...req.body,
      author: req.user.id,
    });
    await mod3d.save();
    res.json(mod3d);
  } catch (err) {
    // Cleanup image on failure (optional)
    if (req.body.imageId) {
      await deleteFileFromS3(req.body.imageId);
    }
    res.status(500).json({ error: "Failed to upload 3D model" });
  }
};

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

module.exports.editModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const existing = await Mod3d.findById(id);

    if (!existing) return res.status(404).json({ error: "Model not found" });

    // 🔄 Delete old image if it's being replaced
    if (updatedFields.imageId && updatedFields.imageId !== existing.imageId) {
      await deleteFileFromS3(existing.imageId);
    }

    // 🔄 Same for 3d model file if you use one
    // if (updatedFields.modelFileId && updatedFields.modelFileId !== existing.modelFileId) {
    //   await deleteFileFromS3(existing.modelFileId);
    // }

    const updated = await Mod3d.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update model", details: err.message });
  }
};

module.exports.deleteModel = async (req, res) => {
  try {
    const mod3d = await Mod3d.findById(req.params.id);
    if (!mod3d) return res.status(404).json({ error: "Model not found" });

    if (!mod3d.author.equals(req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete image from S3
    if (mod3d.imageId) {
      await deleteFileFromS3(mod3d.imageId);
    }

    await Mod3d.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete model", details: err.message });
  }
};
