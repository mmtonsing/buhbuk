// scripts/cleanBrokenPosts.js
import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import { modelsByCategory } from "../models/index.js";
import { deleteFileFromS3 } from "../utils/s3.js";

async function cleanBrokenPosts() {
  await mongoose.connect("mongodb://localhost:27017/bukwarm");

  const posts = await Post.find();
  let deleted = 0;

  for (const post of posts) {
    try {
      const { category, refId } = post;
      const Model = modelsByCategory[category];

      if (!Model) {
        console.warn(`⚠️ Unknown category "${category}" in post ${post._id}`);
        continue;
      }

      const refDoc = await Model.findById(refId);

      if (!refDoc) {
        console.log(`🗑 Deleting broken post (missing ${category}):`, post._id);
        await Post.findByIdAndDelete(post._id);
        deleted++;
        continue;
      }

      // ✅ Category-specific cleanup
      if (category === "Mod3d") {
        if (refDoc.imageId) await deleteFileFromS3(refDoc.imageId);
        if (refDoc.videoId) await deleteFileFromS3(refDoc.videoId);
        if (Array.isArray(refDoc.modelFiles)) {
          for (const file of refDoc.modelFiles) {
            if (file.key) await deleteFileFromS3(file.key);
          }
        }
      }

      // 🔥 Delete ref and post
      await Model.findByIdAndDelete(refId);
      await Post.findByIdAndDelete(post._id);
      console.log(`🧹 Cleaned ${category} + Post:`, refId);
      deleted++;
    } catch (err) {
      console.error("❌ Error cleaning post:", post._id, err.message);
    }
  }

  console.log(
    `✅ Deleted ${deleted} broken posts (and cleaned S3 files if any)`
  );
  process.exit();
}

cleanBrokenPosts();

// node scripts/cleanBrokenPosts.js
