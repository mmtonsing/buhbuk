export const getS3PublicUrl = (key) => {
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const REGION = process.env.AWS_REGION;
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
};
