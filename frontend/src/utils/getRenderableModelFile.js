//  * Returns the first 3D model file (glb, gltf, obj, stl) from the modelFiles array.
//  * @param {Array} modelFiles - Array of model file objects.
//  * @returns {Object|null} - The first renderable file or null.
export function getRenderableModelFile(modelFiles = []) {
  const renderableTypes = ["glb", "gltf", "obj", "stl"];
  return modelFiles.find((file) => renderableTypes.includes(file.type)) || null;
}
