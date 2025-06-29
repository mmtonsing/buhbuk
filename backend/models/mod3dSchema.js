// models/mod3dSchema.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const Mod3dSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: Number,
    isPublic: { type: Boolean, default: true }, // ✅ added earlier

    postId: { type: Schema.Types.ObjectId, ref: "Post" }, // ✅ add this

    imageId: { type: String, required: true },
    videoId: String,
    modelFiles: [
      {
        key: { type: String, required: true },
        type: { type: String, required: true },
        originalName: { type: String, required: true },
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Mod3d", Mod3dSchema);
