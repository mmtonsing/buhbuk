import { transporter } from "./emailTransporter.js";

export async function sendReminderEmail(email, token) {
  const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;

  await transporter.sendMail({
    from: `"BukWarm" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "⏳ Reminder: Verify your BukWarm account",
    html: `
      <p>Hello,</p>
      <p>You registered on BukWarm but haven't verified your email yet.</p>
      <p><b>Your account will be deleted in 24 hours if not verified.</b></p>
      <p>Please verify now by clicking below:</p>
      <a href="${verificationUrl}">Verify My Account</a>
      <p>If you didn't create this account, you can ignore this email.</p>
      <br />
      <p>- BukWarm Team</p>
    `,
  });
}
