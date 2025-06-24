import mongoose from "mongoose";

const { Schema } = mongoose;

const Mod3dSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,

    imageId: { type: String, required: true },
    videoId: String,
    modelFiles: [
      {
        key: { type: String, required: true },
        type: { type: String, required: true },
        originalName: { type: String, required: true },
      },
    ],

    likes: { type: Number, default: 0 },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },

    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("Mod3d", Mod3dSchema);
