export const getVerificationExpiryTime = () =>
  Date.now() + parseInt(process.env.EMAIL_VERIFICATION_EXPIRES_MS || 86400000);
