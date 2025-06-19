const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const mod3d = require("../controllers/mod3d");
const likes = require("../controllers/likes");

// GET: Latest public 3D models for home page
router.get("/public", mod3d.retrieveAllPublic);

router
  .route("/")
  .get(authMiddleware, mod3d.retrieveAll) //retrieve all for specific users(future use)
  .post(authMiddleware, mod3d.uploadModel); //Upload new 3d model

// POST /api/mod3ds/:id/like
router.post("/:id/like", likes.ToggleLike);

router
  .route("/:id")
  .get(mod3d.retrieveModel) //retrieve a model
  .put(authMiddleware, mod3d.editModel) //Edit a 3d model
  .delete(authMiddleware, mod3d.deleteModel); //delete a model

module.exports = router;
