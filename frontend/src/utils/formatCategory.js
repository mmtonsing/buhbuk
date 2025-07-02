export function formatCategory(category) {
  const map = {
    Mod3d: "3D Model",
    Graphic: "Graphic Art",
    Blog: "Blog Post",
  };
  return map[category] || "Post";
}
