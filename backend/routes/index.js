<<<<<<< HEAD
const mod3dRoutes = require("./mod3d");
const userRoutes = require("./users");
const fileRoutes = require("./awsRoutes");

module.exports = {
  mod3dRoutes,
  userRoutes,
  fileRoutes,
};
=======
import mod3dRoutes from "./mod3d.js";
import userRoutes from "./users.js";
import fileRoutes from "./awsRoutes.js";

export { mod3dRoutes, userRoutes, fileRoutes };
>>>>>>> 497afeb (shifting backend to esm)
