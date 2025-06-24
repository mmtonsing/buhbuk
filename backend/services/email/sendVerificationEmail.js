import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendVerificationEmail(toEmail, token) {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  //   from: `"BukWarm" <${process.env.GMAIL_USER}>`,
  const mailOptions = {
    from: `"BukWarm" <BukWarm Service>`,
    to: toEmail,
    subject: "Verify your BukWarm Account",
    html: `
      <h2>Welcome to BukWarm</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${url}">${url}</a>
      <p>This link expires in 24hrs minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
