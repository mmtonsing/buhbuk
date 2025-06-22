import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Mod3d", "Graphic", "Blog", "Culture"], // extendable
    },

    refId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "category", // dynamic reference to the actual content model
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    dateCreated: {
      type: Date,
      default: Date.now,
    },

    subcategory: {
      type: String,
      default: null, // e.g. "Paite", "Mizo", "Thadou"
    },

    tags: {
      type: [String],
      default: [], // e.g. ["language", "poetry", "tribaltech"]
      index: true, // Optional: enables search by tag
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("Post", PostSchema);
