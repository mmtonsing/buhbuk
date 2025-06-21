import mongoose from "mongoose";

const { Schema } = mongoose;

const Mod3dSchema = new Schema({
  title: String,
  description: String,
  price: Number,

<<<<<<< HEAD
  imageId: { type: String, required: true }, // S3 key of thumbnail
=======
  imageId: { type: String, required: true },
>>>>>>> 497afeb (shifting backend to esm)
  videoId: String,
  modelFiles: [
    {
      key: { type: String, required: true },
      type: { type: String, required: true },
      originalName: { type: String, required: true },
    },
  ],

<<<<<<< HEAD
  likes: { type: Number, default: 0 }, //temporary
=======
  likes: { type: Number, default: 0 },
>>>>>>> 497afeb (shifting backend to esm)
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
});

export default mongoose.model("Mod3d", Mod3dSchema);
