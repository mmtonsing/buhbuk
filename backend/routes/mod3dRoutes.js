import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as mod3d from "../controllers/mod3dController.js";
import * as likes from "../controllers/likeController.js";

const router = express.Router();

// GET: Latest public 3D models for home page
router.get("/public", mod3d.retrieveAllPublic);

router
  .route("/")
  .get(authMiddleware, mod3d.retrieveAll) // retrieve all for specific users
  .post(authMiddleware, mod3d.uploadModel); // upload new 3D model

// POST /mod3ds/:id/like
router.post("/:id/like", likes.toggleLike);

router
  .route("/:id")
  .get(mod3d.retrieveModel) // retrieve a model
  .put(authMiddleware, mod3d.editModel) // edit a 3D model
  .delete(authMiddleware, mod3d.deleteModel); // delete a model

export default router;
