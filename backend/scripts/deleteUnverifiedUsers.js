// scripts/deleteUnverifiedUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userSchema.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const deleted = await User.deleteMany({
  emailVerified: false,
  verificationStartedAt: { $lt: sevenDaysAgo }, // only users who began verification 7+ days ago
  createdAt: { $eq: "$createdAt" }, // prevent deleting old verified users who later changed email
});

console.log(
  `🧹 Deleted ${deleted.deletedCount} unverified users (older than 7 days).`
);

await mongoose.disconnect();
