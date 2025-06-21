const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Mod3dSchema = new Schema({
  title: String, //temporary
  description: String, //temporary
  price: Number,

  imageId: { type: String, required: true }, // S3 key of thumbnail
  videoId: String,
  modelFiles: [
    {
      key: { type: String, required: true },
      type: { type: String, required: true },
      originalName: { type: String, required: true },
    },
  ],

  likes: { type: Number, default: 0 }, //temporary
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
    ref: "User", //link to User collection
  },

  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post", // Optional backward reference
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Mod3d", Mod3dSchema);
