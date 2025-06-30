import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as mod3d from "../controllers/mod3dController.js";

const router = express.Router();

router
  .route("/")
  // router.get("/public", mod3d.retrieveAllPublic);
  // .get(authMiddleware, mod3d.retrieveAll) // retrieve all for specific users
  .post(authMiddleware, mod3d.uploadModel); // upload new 3D model

router
  .route("/:id")
  .get(mod3d.retrieveModel) // retrieve a model
  .put(authMiddleware, mod3d.editModel) // edit a 3D model
  .delete(authMiddleware, mod3d.deleteModel); // delete a model

export default router;
