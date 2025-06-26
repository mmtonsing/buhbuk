export function getRenderableModelFile(modelFiles = []) {
  const renderableTypes = ["glb", "gltf", "obj", "stl"];
  return modelFiles.find((file) => renderableTypes.includes(file.type)) || null;
}
