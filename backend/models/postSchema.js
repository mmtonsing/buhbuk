import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ["Mod3d", "Graphic", "Blog"], // extendable
  },

  refId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "category", // dynamic reference to the actual post model
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
});

export default mongoose.model("Post", PostSchema);
