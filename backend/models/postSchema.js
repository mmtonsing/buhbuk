// models/postSchema.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Mod3d", "Graphic", "Blog", "Culture"], // future-proofed
    },
    refId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "category",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // 🔑 Common Display Fields
    title: { type: String, required: true },
    imageUrl: { type: String }, // ✅ full public S3 image URL or presigned
    summary: { type: String }, // for blogs or short description

    // 🔒 Access Control
    isPublic: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },

    // 🏷️ Meta
    subcategory: { type: String, default: null }, // e.g., "Paite", "Zou"
    tags: { type: [String], default: [], index: true },
  },
  {
    timestamps: true, // includes createdAt, updatedAt
  }
);

export default mongoose.model("Post", PostSchema);
