import connectDB from "../utils/database.js";
import User from "../models/userSchema.js";

export async function runDeleteScript() {
  await connectDB();

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const deleted = await User.deleteMany({
    emailVerified: false,
    wasEverVerified: { $ne: true },
    verificationStartedAt: { $lt: threeDaysAgo },
  });

  console.log(`🧹 Deleted ${deleted.deletedCount} unverified users`);
}
