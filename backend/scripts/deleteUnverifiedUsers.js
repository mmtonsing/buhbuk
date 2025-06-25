import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userSchema.js";

dotenv.config();
await mongoose.connect(process.env.ATLAS_URI);

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

const deleted = await User.deleteMany({
  emailVerified: false,
  wasEverVerified: { $ne: true },
  verificationStartedAt: { $lt: threeDaysAgo },
});

console.log(
  `🧹 Deleted ${deleted.deletedCount} unverified users (older than 3 days).`
);

await mongoose.disconnect();
