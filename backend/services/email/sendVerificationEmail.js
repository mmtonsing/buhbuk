import { transporter } from "./emailTransporter.js";

export async function sendVerificationEmail(toEmail, token) {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  // from: `"BukWarm" <BukWarm Service>`,
  const mailOptions = {
    from: `"BukWarm" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your BukWarm Account",
    html: `
      <h2>Welcome to BukWarm</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${url}">${url}</a>
      <p>This link expires in ${
        Number(process.env.EMAIL_VERIFICATION_EXPIRES_MS || 86400000) / 3600000
      } hours</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
