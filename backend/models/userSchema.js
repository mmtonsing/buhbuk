import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpires: Date,
    posts: String,
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 });

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", UserSchema);

// posts: [{ type: Schema.Types.ObjectId, ref: "Post" }];
