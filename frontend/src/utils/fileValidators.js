// utils/fileValidators.js
export function getFileExtension(file) {
  return file.name.split(".").pop().toLowerCase();
}
