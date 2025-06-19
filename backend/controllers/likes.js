const mongoose = require("mongoose");
const Mod3D = require("../models/mod3d");

module.exports.ToggleLike = async (req, res) => {
  const modId = req.params.id;
  const userId = req.body.userId;

  try {
    const mod = await Mod3D.findById(modId);
    if (!mod) return res.status(404).json({ message: "Mod not found" });

    // const userObjectId = new mongoose.Types.ObjectId(userId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    // Find index correctly using equals() if stored as ObjectId
    const index = mod.likedBy.findIndex((id) => id.equals(userObjectId));

    let liked;

    if (index === -1) {
      mod.likedBy.push(userObjectId); // Add like
      liked = true;
    } else {
      mod.likedBy.splice(index, 1);
      liked = false;
    }

    // 🛡️ Ensure uniqueness: prevent duplicates
    // mod.likedBy = [...new Set(mod.likedBy.map((id) => id.toString()))];

    await mod.save();

    res.json({ liked, count: mod.likedBy.length });
  } catch (err) {
    console.error("ToggleLike error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};
