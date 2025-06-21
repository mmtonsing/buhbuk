<<<<<<< HEAD
// models/Post.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

=======
import mongoose from "mongoose";

const { Schema } = mongoose;

>>>>>>> 497afeb (shifting backend to esm)
const PostSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ["Mod3d", "Graphic", "Blog"], // extendable
  },

<<<<<<< HEAD
  contentRef: {
=======
  refId: {
>>>>>>> 497afeb (shifting backend to esm)
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

<<<<<<< HEAD
module.exports = mongoose.model("Post", PostSchema);
=======
export default mongoose.model("Post", PostSchema);
>>>>>>> 497afeb (shifting backend to esm)
