// utils/validators.js
export const isValidZip = (file) => {
  if (!file) return false;
  const allowedMimeTypes = ["application/zip", "application/x-zip-compressed"];
  return allowedMimeTypes.includes(file.mimetype);
};
