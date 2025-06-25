//#region imports
import mongoose from "mongoose";
import Mod3D from "../models/mod3dSchema.js";
import asyncHandler from "express-async-handler";
//#endregion

//#region 🔁 Toggle Like
export const toggleLike = asyncHandler(async (req, res) => {
  const modId = req.params.id;
  const userId = req.body.userId;

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
  res.status(200).json({
    success: true,
    liked,
    count: mod.likedBy.length,
  });
});
//#endregion
