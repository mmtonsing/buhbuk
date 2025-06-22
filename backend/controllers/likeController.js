import mongoose from "mongoose";
import Mod3D from "../models/mod3dSchema.js";

export const ToggleLike = async (req, res) => {
  const modId = req.params.id;
  const userId = req.body.userId;

  try {
    const mod = await Mod3D.findById(modId);
    if (!mod) return res.status(404).json({ message: "Mod not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const index = mod.likedBy.findIndex((id) => id.equals(userObjectId));

    let liked;

    if (index === -1) {
      mod.likedBy.push(userObjectId); // Add like
      liked = true;
    } else {
      mod.likedBy.splice(index, 1); // Remove like
      liked = false;
    }

    await mod.save();

    res.json({ liked, count: mod.likedBy.length });
  } catch (err) {
    console.error("ToggleLike error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};
