import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userSchema.js";
import { sendReminderEmail } from "../services/email/sendReminderEmail.js";

dotenv.config();
await mongoose.connect(process.env.ATLAS_URI);

const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
const oneDayWindowStart = new Date(twoDaysAgo.getTime() - 24 * 60 * 60 * 1000);

const usersToRemind = await User.find({
  emailVerified: false,
  wasEverVerified: { $ne: true },
  verificationStartedAt: { $gt: oneDayWindowStart, $lt: twoDaysAgo },
  reminderSentAt: { $exists: false },
});

console.log(`Found ${usersToRemind.length} users to remind.`);

for (const user of usersToRemind) {
  try {
    console.log(
      "Email:",
      process.env.GMAIL_USER,
      "Pass:",
      !!process.env.GMAIL_PASS
    );
    console.log(user);
    await sendReminderEmail(user.email, user.verificationToken);
    console.log("succeed");
    user.reminderSentAt = new Date();
    await user.save();
    console.log(`✉️ Reminder sent to ${user.email}`);
  } catch (err) {
    console.error(`❌ Failed to send reminder to ${user.email}:`, err);
  }
}

await mongoose.disconnect();
