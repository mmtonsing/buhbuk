import connectDB from "../utils/database.js";
import User from "../models/userSchema.js";
import { sendReminderEmail } from "../services/email/sendReminderEmail.js";

export async function runReminderScript() {
  await connectDB(); // Use shared, safe connection method

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const oneDayWindowStart = new Date(
    twoDaysAgo.getTime() - 24 * 60 * 60 * 1000
  );

  const usersToRemind = await User.find({
    emailVerified: false,
    wasEverVerified: { $ne: true },
    verificationStartedAt: { $gt: oneDayWindowStart, $lt: twoDaysAgo },
    reminderSentAt: { $exists: false },
  });

  console.log(`Found ${usersToRemind.length} users to remind.`);

  for (const user of usersToRemind) {
    try {
      await sendReminderEmail(user.email, user.verificationToken);
      user.reminderSentAt = new Date();
      await user.save();
      console.log(`✉️ Reminder sent to ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to send reminder to ${user.email}:`, err);
    }
  }

  // Don't disconnect — app may still be using Mongo
}
